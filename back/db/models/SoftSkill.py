from sqlmodel import SQLModel, Field, Relationship
from typing import List

class SoftSkill(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    label: str = Field(max_length=20)
    job_offers: List["NeedToHaveSoftSkill"] = Relationship(back_populates="soft_skill")