from typing import Optional
from sqlmodel import Field, SQLModel
from enum import Enum
from decimal import Decimal
from back.db.models.Application import Status
import datetime

class ApplicationCreate(SQLModel):
    application_date: Optional[datetime.date] = Field(default_factory=datetime.date.today, description="Date of application submission")
    status: Status = Field(default=Status.waiting, description="Status of the application")
    ats_prenotation: Optional[Decimal] = Field(default=None, ge=0, description="ATS pre-notation, must be non-negative")
    ats_final_note: Optional[Decimal] = Field(default=None, ge=0, description="Final note from ATS, must be non-negative")
    cv_link: str = Field(..., description="Link to the candidate's CV")
    feedback: Optional[str] = Field(default=None, description="Feedback on the application")
    cv_link: str = Field(..., max_length=100)
    id_candidate: int = Field(..., description="ID of the candidate applying")
    id_job_offer: int = Field(..., description="ID of the job offer being applied to")

class ApplicationUpdate(SQLModel):
    status: Optional[Status] = Field(default=None, description="Updated status of the application")
    cv_link: Optional[str] = Field(default=None, max_length=100)
    ats_prenotation: Optional[Decimal] = Field(default=None, ge=0, description="Updated ATS pre-notation, must be non-negative")
    ats_final_note: Optional[Decimal] = Field(default=None, ge=0, description="Updated final note from ATS, must be non-negative")
    feedback: Optional[str] = Field(default=None, description="Updated feedback on the application")

class ApplicationRead(SQLModel):
    id: int = Field(..., description="Unique identifier for the application")
    application_date: datetime.date = Field(..., description="Date of application submission")
    status: Status = Field(..., description="Current status of the application")
    ats_prenotation: Optional[Decimal] = Field(default=None, ge=0, description="ATS pre-notation, must be non-negative")
    ats_final_note: Optional[Decimal] = Field(default=None, ge=0, description="Final note from ATS, must be non-negative")
    feedback: Optional[str] = Field(default=None, description="Feedback on the application")
    cv_link: str = Field(max_length=100)
    id_candidate: int = Field(..., description="ID of the candidate applying")
    id_job_offer: int = Field(..., description="ID of the job offer being applied to")

    class Config:
        orm_mode = True