import os
from back.core.config import settings
from fastapi import APIRouter,File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path

file_upload_router = APIRouter()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@file_upload_router.post("/upload/{candidate_id}/{application_id}", tags=["FileUpload"])
async def upload_file(candidate_id: int, application_id:int,file:UploadFile=File(...)):
    candidate_dir = f"{settings.UPLOAD_DIR}/{str(candidate_id)}/applications/{str(application_id)}"
    os.makedirs(candidate_dir, exist_ok=True)

    file_location = candidate_dir+'/'+file.filename

    try:
        with open(file_location, "wb") as f:
            content = await file.read()
            f.write(content)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'enregistrement du fichier :{str(e)}")
    return JSONResponse(content={"filename": file.filename, "path": str(file_location)})

@file_upload_router.get("/files/{candidate_id}/{application_id}", tags=["FileUpload"])
async def list_files(candidate_id: int, application_id: int):
    candidate_dir = Path(f"{settings.UPLOAD_DIR}/{str(candidate_id)}/applications/{str(application_id)}")
    
    if not candidate_dir.exists():
        raise HTTPException(status_code=404, detail="Répertoire de candidature non trouvé.")

    files = [f.name for f in candidate_dir.iterdir() if f.is_file()]
    return JSONResponse(content={"files": files})

@file_upload_router.get("/download/{candidate_id}/{application_id}/{file_name}", tags=["FileUpload"])
async def download_file(candidate_id: int, application_id: int, file_name: str):
    candidate_dir = Path(settings.UPLOAD_DIR) / str(candidate_id) / "applications" / str(application_id)
    file_path = candidate_dir / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier non trouvé.")

    return FileResponse(file_path)