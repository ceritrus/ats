from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.sqlite import TEXT
from decimal import Decimal
import datetime
from typing import List, Optional

class JobOffer(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    job_ref: str = Field(max_length=12)
    title: str = Field(max_length=50)
    job_location: str = Field(max_length=100)
    salary: Decimal = Field(0.0)
    description: str = Field(sa_column=Column(TEXT))
    company_description: str = Field(sa_column=Column(TEXT))
    posted_date: datetime.date = Field(default_factory=lambda: datetime.datetime.now().date())
    end_of_application: datetime.date
    id_recruiter: int = Field(foreign_key="recruiter.id")
    recruiter: Optional["Recruiter"] = Relationship(back_populates="job_offers")
    applications: List["Application"] = Relationship(back_populates="job_offer")
    need_to_have_skills: List["NeedToHaveSkill"] = Relationship(back_populates="job_offer")
    need_to_have_soft_skills: List["NeedToHaveSoftSkill"] = Relationship(back_populates="job_offer")