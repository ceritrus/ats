from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(max_length=50, unique=True)
    email: str = Field(max_length=100, unique=True)
    password: str
    recruiter: "Recruiter" = Relationship(back_populates="user", cascade_delete=True)
    recruiter: "Candidate" = Relationship(back_populates="user", cascade_delete=True)
