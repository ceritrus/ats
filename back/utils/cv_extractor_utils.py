import pdfplumber
import spacy
import re
from typing import List, Dict
from dateutil import parser
from datetime import datetime
from back.core.config import settings
from back.db.models.JobOffer import JobOffer


class CVExtractorUtils:
    def __init__(self):
        self.nlp = spacy.load("fr_core_news_lg")

    def read_pdf(self, cv_file_path: str) -> str:
        extracted_text = ""
        with pdfplumber.open(cv_file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                page_text = re.sub(r'\s+', ' ', page_text) 
                page_text = page_text.replace("\n", " ") 
                extracted_text += page_text + "\n"  
        return extracted_text.lower() 
    
    def extract_cv_data(self, extracted_text: str, job_offer:JobOffer) -> Dict:
        doc = self.nlp(extracted_text)
        skills = self.extract_skills(doc, [skill.label for skill in job_offer.skills])
        soft_skills = self.extract_soft_skills(doc, [soft_skill.label for soft_skill in job_offer.soft_skills])
        experience_years = self.extract_experience(extracted_text)
        job_title = self.extract_job_title(doc)
        graduate = self.extract_graduate(extracted_text)
        location = self.extract_location(doc, job_offer.job_location) 

        return {
            "skills": skills,
            "soft_skills": soft_skills,
            "experience_years": experience_years,
            "job_title": job_title,
            "graduate": graduate,
            "location": location,
            "token_number":len(doc)
        }

    def extract_skills(self, doc, required_skills: List[str]) -> List[str]:
        skills = []
        cv_text = " ".join([token.text.lower() for token in doc])

        for required_skill in required_skills:
            skill_tokens = " ".join([token.text.lower() for token in self.nlp(required_skill)])
            if skill_tokens in cv_text:
                skills.append(required_skill)
        return list(set(skills))

    def extract_soft_skills(self, doc, required_soft_skills: List[str]) -> List[str]:
        soft_skills = []
        cv_text = " ".join([token.text.lower() for token in doc])

        for required_soft_skill in required_soft_skills:
            skill_tokens = " ".join([token.text.lower() for token in self.nlp(required_soft_skill)])
            if skill_tokens in cv_text:
                soft_skills.append(required_soft_skill)
        return list(set(soft_skills))

    def extract_experience(self, text: str) -> int:
        date_patterns = [
            r"(\d{2}/\d{4})\s*-\s*(\d{2}/\d{4})",  
            r"(\d{4})\s*-\s*(\d{4})"              
        ]
        experience_years = 0

        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if len(match) == 2:
                    try:
                        start_date = parser.parse(match[0], dayfirst=True)
                        end_date = parser.parse(match[1], dayfirst=True)
                        duration = (end_date.year - start_date.year) + (end_date.month - start_date.month) / 12
                        experience_years += duration
                    except Exception as e:
                        print(f"Erreur lors de l'analyse des dates : {e}")
        return int(experience_years)

    def extract_job_title(self, doc) -> str:
        for ent in doc.ents:
            if ent.label_ == "MISC":
                return ent.text
        return "Titre de poste inconnu"

    def extract_graduate(self, text: str) -> str:
        graduate_keywords = [
            "licence", "bts", "dut", "but", 
            "master", "doctorat", "post-doctorat", 
            "diplôme", "certificat"
        ]

        for keyword in graduate_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text):
                return keyword.capitalize()

        return "Niveau d'études inconnu"

    def extract_location(self, doc, job_location: str) -> str:
        detected_locations = []

        for token in doc:
            if token.text.lower() == "localisation":
                index = token.i + 1
                location_text = []
                while index < len(doc) and doc[index].text not in ["", "\n"]:
                    location_text.append(doc[index].text)
                    index += 1
                location = " ".join(location_text).strip()
                if location:  
                    detected_locations.append(location)

        for ent in doc.ents:
            if ent.label_ == "LOC":
                detected_locations.append(ent.text)

        for location in detected_locations:
            if location.lower() == job_location.lower():
                return location

        return "Localisation inconnue"

    def cosine_similarity(self, vec_a, vec_b):
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = sum(a ** 2 for a in vec_a) ** 0.5
        norm_b = sum(b ** 2 for b in vec_b) ** 0.5
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    def jaccard_similarity(self, set_a, set_b):
        intersection = len(set_a.intersection(set_b))
        union = len(set_a.union(set_b))
        if union == 0:
            return 0.0
        return intersection / union
    
    def calculate_score(self, job_offer: JobOffer, cv_file_path: str) -> float:
        extracted_text = self.read_pdf(settings.UPLOAD_DIR+"/"+cv_file_path)
        cv_data = self.extract_cv_data(extracted_text, job_offer)

        score = 0
        max_score = 5


        cv_text = extracted_text
        job_description = job_offer.description.lower()


        cv_words = cv_text.split()
        job_description_words = job_description.split()


        all_words = list(set(cv_words) | set(job_description_words))
        cv_vector = [1 if word in cv_words else 0 for word in all_words]
        job_description_vector = [1 if word in job_description_words else 0 for word in all_words]

        cosine_sim = self.cosine_similarity(cv_vector, job_description_vector)


        jaccard_sim = self.jaccard_similarity(set(cv_words), set(job_description_words))


        required_skills = [skill.label for skill in job_offer.skills]
        cv_skills = self.extract_skills(self.nlp(extracted_text), required_skills)
        matching_skills = len(set(required_skills).intersection(cv_skills))
        if required_skills:
            skills_score = matching_skills / len(required_skills)
            score += skills_score * 1.5


        required_soft_skills = [soft_skill.label for soft_skill in job_offer.soft_skills]
        cv_soft_skills = self.extract_soft_skills(self.nlp(extracted_text), required_soft_skills)
        matching_soft_skills = len(set(required_soft_skills).intersection(cv_soft_skills))
        if required_soft_skills:
            if len(required_soft_skills) == 1:
                soft_skills_score = 1.0 if matching_soft_skills > 0 else 0.0
            else:
                soft_skills_score = matching_soft_skills / len(required_soft_skills)
            score += soft_skills_score * 1.0


        required_experience = job_offer.experience
        cv_experience = cv_data.get("experience_years", 0)
        experience_score = min(cv_experience / required_experience, 1) if required_experience > 0 else 0
        score += experience_score * 1.0

        job_title = job_offer.title.lower()
        cv_job_title = cv_data.get("job_title", "").lower()
        if job_title in cv_job_title or cv_job_title in job_title:
            score += 0.5


        job_graduate = job_offer.graduate.value.lower()
        cv_graduate = cv_data.get("graduate", "").lower()
        if job_graduate == cv_graduate:
            score += 0.5

        job_location = job_offer.job_location.lower()
        cv_location = cv_data.get("location", "").lower()
        if job_location == cv_location:
            score += 0.5

        score += cosine_sim * 0.5 
        score += jaccard_sim * 0.5 

        final_score = min(score, max_score)
        return {
            "final_score": round(final_score, 2),
            "cv_data": cv_data,
            "cv_token_number":cv_data.get("token_number"),
            "job_desc_token_number":len(self.nlp(job_offer.description)),
            "cosine_similarity": round(cosine_sim, 2),
            "jaccard_similarity": round(jaccard_sim, 2)
        }

extractor = CVExtractorUtils()
#  result = extractor.calculate_score(job_offer, cv_file_path)
# print(f"Score final: {result['final_score']}")
# print(f"Similarité cosinus: {result['cosine_similarity']}")
# print(f"Similarité de Jaccard: {result['jaccard_similarity']}")
# if __name__ == "__main__":
#     cv_file_path = "../../uploads/cv_example.pdf"
#     job_offer = {
#         "skills": ["Python", "Apprentissage automatique"],
#         "soft_skills": ["Communication"],
#         "experience": 2,
#         "job_title": "Data Scientist",
#         "graduate": "Licence",
#         "job_location": "Paris",
#         "job_description": """
#         Nous recherchons un Data Scientist passionné par les données et l'intelligence artificielle.
#         Le candidat idéal devra posséder une solide expérience en apprentissage automatique et en analyse de données.
#         Vous serez chargé de développer des modèles de machine learning pour la prédiction des ventes, 
#         en utilisant Python et des frameworks comme Scikit-learn et TensorFlow. 
#         L'analyse de grands ensembles de données pour extraire des insights stratégiques est essentielle, 
#         ainsi que la présentation des résultats aux équipes commerciales pour faciliter la prise de décisions basées sur les données. 
#         Une expérience dans la création de dashboards interactifs en Tableau est un plus.
#         Vous devez être capable de travailler en équipe et posséder de bonnes compétences en communication.
#         """
#     }


