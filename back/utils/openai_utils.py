import json
from openai import OpenAI
from back.core.config import settings

class CVScoreEvaluator:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def chatty_estimate(self, cv_data: dict) -> str:
        system_prompt = (
            "Tu es une API d'évaluation de CV qui ajuste la note de correspondance entre un profil candidat et une description de poste. "
            "Voici les informations fournies :\n\n"
            "- `final_score` : note actuelle sur 5 attribuée au CV.\n"
            "- `cv_data` : détails du CV incluant les compétences techniques, compétences douces, années d'expérience, titre du poste, "
            "niveau d'études, localisation, et nombre de tokens dans le CV.\n"
            "- `cv_token_number` : nombre total de tokens dans le CV.\n"
            "- `job_desc_token_number` : nombre total de tokens dans la description de poste.\n"
            "- `cosine_similarity` : mesure de similarité cosinus entre le CV et la description de poste.\n"
            "- `jaccard_similarity` : mesure de similarité Jaccard entre le CV et la description de poste.\n\n"
            "Utilise tous ces paramètres pour ajuster librement le `final_score` sur une échelle de 5, en décidant toi-même des ajustements "
            "appropriés jusqu’à un point maximum (vers le haut ou le bas), et en permettant des décimales avec une précision jusqu'à deux chiffres "
            "après la virgule.\n\n"
            "Retourne uniquement le `final_score` ajusté en format JSON, comme ceci :\n\n"
            "{\"final_score\": ajustement}"
        )

        user_message = {
            "role": "user",
            "content": str(cv_data)
        }

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                user_message
            ],
            temperature=1,
            max_tokens=50,  
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        response_content = response.choices[0].message.content.strip()

        final_score_data = json.loads(response_content)

        final_score = final_score_data.get("final_score")

        return final_score 

evaluator = CVScoreEvaluator(settings.OPENAI_KEY)