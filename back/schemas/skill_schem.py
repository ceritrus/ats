from sqlmodel import Field, SQLModel
from typing import Optional

class SkillCreate(SQLModel):
    label: str = Field(..., max_length=20)

class SkillUpdate(SQLModel):
    label: Optional[str] = Field(..., max_length=20)

class SkillRead(SQLModel):
    id: int
    label: str = Field(..., max_length=20)  
    class Config:
        orm_mode = True