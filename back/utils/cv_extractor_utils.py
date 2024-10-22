import re
import fitz  # PyMuPDF
from typing import Dict, List
from back.db.models import JobOffer
def extract_text_from_cv(pdf_path: str) -> str:
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc: 
            text += page.get_text() + "\n" 
    return text

def score_cv(cv_text: str, job_offer: JobOffer) -> float:
    score = 0
    total_criteria = 0

    required_skills = [skill.skill.label for skill in job_offer.need_to_have_skills]
    if required_skills:
        total_criteria += len(required_skills)
        for skill in required_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', cv_text, re.IGNORECASE):
                score += 1


    job_title = job_offer.title
    if re.search(r'\b' + re.escape(job_title) + r'\b', cv_text, re.IGNORECASE):
        score += 1
        total_criteria += 1  

    job_location = job_offer.job_location
    if re.search(r'\b' + re.escape(job_location) + r'\b', cv_text, re.IGNORECASE):
        score += 1
        total_criteria += 1  

    if total_criteria > 0:
        final_score = (score / total_criteria) * 5  
    else:
        final_score = 0

    return final_score

def process_cv_and_evaluate(pdf_path: str, job_offer: JobOffer) -> Dict[str, any]:
    cv_text = extract_text_from_cv(pdf_path)
    score = score_cv(cv_text, job_offer)
    return {"score": score, "cv_text": cv_text}
