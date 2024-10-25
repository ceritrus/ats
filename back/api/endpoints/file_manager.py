import os
from back.core.config import settings
from fastapi import APIRouter,File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
import random
import string
from back.api.auth import role_required
file_upload_router = APIRouter()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

def generate_random_filename(extension="", length=10):
    characters = string.ascii_letters + string.digits  # a-zA-Z0-9
    while True:
        random_name = ''.join(random.choices(characters, k=length))
        if extension:
            random_name += f".{extension}"
        yield random_name

@file_upload_router.post("/upload/", tags=["FileUpload"], dependencies=[Depends(role_required(["Recruiter", "Candidate"]))])
async def upload_file(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    candidate_dir = f"{settings.UPLOAD_DIR}/"
    os.makedirs(candidate_dir, exist_ok=True)

    random_name_generator = generate_random_filename("pdf")
    while True:
        random_filename = next(random_name_generator)
        file_location = os.path.join(candidate_dir, random_filename)
        if not os.path.exists(file_location):
            break
    try:
        with open(file_location, "wb") as f:
            content = await file.read()
            f.write(content)
        return JSONResponse({"cv_name": random_filename}, 200)
    except Exception as e:
        return {"error": str(e)}
    
@file_upload_router.get("/download/{file_name}", tags=["FileUpload"], dependencies=[Depends(role_required(["Recruiter", "Candidate"]))])
async def download_file(file_name: str):
    candidate_dir = Path(settings.UPLOAD_DIR)
    file_path = candidate_dir / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier non trouvé.")

    return FileResponse(file_path)