from sqlmodel import SQLModel

class SkillCreate(SQLModel):
    label: str

class SkillRead(SQLModel):
    id: int
    label: str

    class Config:
        orm_mode = True