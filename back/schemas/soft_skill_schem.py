from sqlmodel import Field, SQLModel

class SoftSkillCreate(SQLModel):
    label: str = Field(..., max_length=20)

class SoftSkillUpdate(SQLModel):
    label: Optional[str] = Field(..., max_length=20)

class SoftSkillRead(SQLModel):
    id: int
    label: str = Field(..., max_length=20)  
    
    class Config:
        orm_mode = True