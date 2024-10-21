from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME : str = "ATS With AI"
    ALLOWED_HOSTS: list = ['*']
    DATABASE_URL: str = "sqlite:///./ats.db"

    class Config:
        env_file = ".env"

settings = Settings()