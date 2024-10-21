from sqlmodel import SQLModel, Field, Relationship
from back.db.models.User import User

class Recruiter(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=100)
    phone_number: str = Field(max_length=10, unique=True)
    id_user: int = Field(foreign_key='user.id', unique=True)
    user: User = Relationship(back_populates="recruiter")