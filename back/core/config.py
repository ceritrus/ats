from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME : str = "ATS With AI"
    ALLOWED_HOSTS: list = ['*']
    DATABASE_URL: str = "sqlite:///./ats.db"
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"

settings = Settings()