from sqlmodel import SQLModel, Field, Relationship
from back.db.models.JobOffer import JobOffer
from back.db.models.Skill import Skill


class NeedToHaveSkill(SQLModel, table=True):
    id_job_offer: int = Field(foreign_key="joboffer.id", primary_key=True)
    id_skill: int = Field(foreign_key="skill.id", primary_key=True)

    job_offer: JobOffer = Relationship(back_populates="need_to_have_skills")
    skill: Skill = Relationship(back_populates="job_offers")