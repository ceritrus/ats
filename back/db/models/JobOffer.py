from enum import Enum
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.sqlite import TEXT
from decimal import Decimal
import datetime
from sqlalchemy import Enum as SQLAlchemyEnum
from typing import List, Optional

class Graduate(Enum):
    undergraduate = "Premier cycle universitaire"
    dut = "DUT"
    but = "BUT"
    bts = "BTS"
    bachelor = "Licence"
    master = "Master"
    phd = "Doctorat"
    postdoctoral = "Post-doctorat"
    diploma = "Diplôme spécialisé"
    certificate = "Certificat"


class JobOffer(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    job_ref: str = Field(max_length=12)
    title: str = Field(max_length=50)
    job_location: str = Field(max_length=100)
    graduate: Graduate = Field(sa_column=Column(SQLAlchemyEnum(Graduate)))
    experience: int = Field(default=0)
    salary: Decimal = Field(0.0)
    description: str = Field(sa_column=Column(TEXT))
    company_description: str = Field(sa_column=Column(TEXT))
    posted_date: datetime.date = Field(default_factory=lambda: datetime.datetime.now().date())
    end_of_application: datetime.date
    id_recruiter: int = Field(foreign_key="recruiter.id")
    recruiter: Optional["Recruiter"] = Relationship(back_populates="job_offers")
    applications: List["Application"] = Relationship(back_populates="job_offer")
    need_to_have_skills: List["NeedToHaveSkill"] = Relationship(back_populates="job_offer", cascade_delete=True)
    need_to_have_soft_skills: List["NeedToHaveSoftSkill"] = Relationship(back_populates="job_offer", cascade_delete=True)
    @property
    def skills(self) -> List["Skill"]:
        return [need_skill.skill for need_skill in self.need_to_have_skills]

    @property
    def soft_skills(self) -> List["SoftSkill"]:
        return [need_soft_skill.soft_skill for need_soft_skill in self.need_to_have_soft_skills]
    
    @soft_skills.setter
    def soft_skills(self, new_soft_skills: List["SoftSkill"]):
        self.need_to_have_soft_skills.clear()
        self.need_to_have_soft_skills.extend(new_soft_skills)

    @soft_skills.setter
    def skills(self, new_skills: List["Skill"]):
        self.need_to_have_skills.clear()
        self.need_to_have_skills.extend(new_skills)