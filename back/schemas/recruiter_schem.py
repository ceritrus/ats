from sqlmodel import SQLModel, Field
from typing import Optional

class RecruiterBase(SQLModel):
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=100)
    phone_number: str = Field(max_length=10)
    id_user: int

class RecruiterUpdate(SQLModel):
    first_name: Optional[str] = Field(default=None, max_length=50)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone_number: Optional[str] = Field(default=None, max_length=10)
    id_user: Optional[int] = Field(default=None)

class RecruiterCreate(RecruiterBase):
    pass

class RecruiterRead(RecruiterBase):
    id: int