from sqlmodel import create_engine, SQLModel, Session
from back.db.models import NeedToHaveSkill, NeedToHaveSoftSkill

DATABASE_URL = "sqlite:///./ats.sqlite3" 

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Session:
    return Session(engine)