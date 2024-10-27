from typing import Optional
from sqlmodel import SQLModel, Field

class CandidateBase(SQLModel):
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=100)
    phone_number: str = Field(max_length=10)
    cv_link: str = Field(max_length=100)
    id_user: int

class CandidateUpdate(SQLModel):
    first_name: Optional[str] = Field(max_length=50)
    last_name: Optional[str] = Field(max_length=100)
    phone_number: Optional[str] = Field(max_length=10)
    cv_link: Optional[str] = Field(max_length=100)

class CandidateCreate(CandidateBase):
    pass

class CandidateRead(CandidateBase):
    id: int