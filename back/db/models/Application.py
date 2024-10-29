from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.sqlite import TEXT
from enum import Enum
from decimal import Decimal
from sqlalchemy import Enum as SQLAlchemyEnum
import datetime

class Status(Enum):
    processing = "Processing"
    rejected = "Rejected"
    waiting = "Waiting"
    received = "Received"

class Application(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    application_date: datetime.date = Field(default_factory=datetime.datetime.now().date)
    status: Status = Field(sa_column=Column(SQLAlchemyEnum(Status)))
    ats_prenotation: Decimal = Field(default=0, max_digits=3, decimal_places=2)
    ats_final_note : Decimal = Field(default=0, max_digits=3, decimal_places=2)
    feedback: str = Field(sa_column=Column(TEXT))
    applicant_message: str = Field(default=None, max_length=1500)
    cv_link: str = Field(max_length=100)
    id_candidate: int = Field(foreign_key="candidate.id")    
    id_job_offer: int = Field(foreign_key="joboffer.id")
    candidate: "Candidate" = Relationship(back_populates="applications")
    job_offer: "JobOffer" = Relationship(back_populates="applications")

