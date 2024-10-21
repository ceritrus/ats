from typing import Optional
from decimal import Decimal
import datetime
from sqlmodel import SQLModel
from typing import List, Optional

class JobOfferCreate(SQLModel):
    job_ref: str
    title: str
    job_location: str
    salary: Decimal
    description: str
    company_description: str
    posted_date: Optional[datetime.date] = None
    end_of_application: datetime.date
    id_recruiter: int
    skill_ids: Optional[List[int]] = []  
    soft_skill_ids: Optional[List[int]] = []  
class JobOfferRead(SQLModel):
    id: int
    job_ref: str
    title: str
    job_location: str
    salary: Decimal
    description: str
    company_description: str
    posted_date: datetime.date
    end_of_application: datetime.date
    id_recruiter: int

    class Config:
        orm_mode = True