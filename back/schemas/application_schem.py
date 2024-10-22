from typing import Optional
from sqlmodel import SQLModel
from enum import Enum
from decimal import Decimal
from back.db.models.Application import Status
import datetime

class ApplicationCreate(SQLModel):
    application_date: Optional[datetime.date] = None 
    status: Status = Status.waiting
    ats_prenotation: Optional[Decimal] = None
    ats_final_note: Optional[Decimal] = None
    cv_link:str
    feedback: Optional[str] = None
    id_candidate: int  
    id_job_offer: int

class ApplicationUpdate(SQLModel):
    status: Optional[Status] = None
    ats_prenotation: Optional[Decimal] = None
    ats_final_note: Optional[Decimal] = None
    feedback: Optional[str] = None

class ApplicationRead(SQLModel):
    id: int
    application_date: datetime.date
    status: Status
    ats_prenotation: Optional[Decimal] = None
    ats_final_note: Optional[Decimal] = None
    feedback: Optional[str] = None
    id_candidate: int  
    id_job_offer: int
    class Config:
        orm_mode = True  