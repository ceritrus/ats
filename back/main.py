from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from back.core.config import settings
from back.api.router import api_router
from back.db.database import create_db_and_tables

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A brief description of your project.",
    version="1.0.0",
    swagger_ui_parameters={"docExpansion": "none"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(api_router, prefix="/api")
create_db_and_tables()
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Working well"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)