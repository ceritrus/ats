from sqlmodel import SQLModel, Field, Relationship
from back.db.models.JobOffer import JobOffer
from back.db.models.SoftSkill import SoftSkill

class NeedToHaveSoftSkill(SQLModel, table=True):
    id_job_offer: int = Field(foreign_key="joboffer.id", primary_key=True)
    id_soft_skill: int = Field(foreign_key="softskill.id", primary_key=True)

    job_offer: JobOffer = Relationship(back_populates="need_to_have_soft_skills")
    soft_skill: SoftSkill = Relationship(back_populates="job_offers")