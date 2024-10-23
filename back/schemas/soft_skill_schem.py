from sqlmodel import SQLModel

class SoftSkillCreate(SQLModel):
    label: str

class SoftSkillRead(SQLModel):
    id: int
    label: str

    class Config:
        orm_mode = True