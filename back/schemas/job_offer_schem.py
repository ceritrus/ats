from typing import Optional
from decimal import Decimal
import datetime
from sqlmodel import Field, SQLModel
from typing import List, Optional

class JobOfferCreate(SQLModel):
    job_ref: str = Field(..., max_length=12, description="Unique reference for the job offer")
    title: str = Field(..., max_length=50, description="Title of the job offer")
    job_location: str = Field(..., max_length=100, description="Location of the job")
    salary: Decimal = Field(..., gt=0, description="Salary for the job offer, must be greater than zero")
    description: str = Field(..., description="Detailed description of the job offer")
    company_description: str = Field(..., description="Description of the company")
    posted_date: Optional[datetime.date] = Field(default_factory=datetime.date.today, description="Date the job was posted")
    end_of_application: datetime.date = Field(..., description="Deadline for applications")
    id_recruiter: int = Field(..., description="ID of the recruiter posting the job offer")
    skill_ids: Optional[List[int]] = Field(default=None, description="List of skill IDs required for the job")
    soft_skill_ids: Optional[List[int]] = Field(default=None, description="List of soft skill IDs required for the job")
    
class JobOfferUpdate(SQLModel):
    job_ref: Optional[str] = Field(default=None, max_length=12, description="Unique reference for the job offer")
    title: Optional[str] = Field(default=None, max_length=50, description="Title of the job offer")
    job_location: Optional[str] = Field(default=None, max_length=100, description="Location of the job")
    salary: Optional[Decimal] = Field(default=None, gt=0, description="Salary for the job offer, must be greater than zero")
    description: Optional[str] = Field(default=None, description="Detailed description of the job offer")
    company_description: Optional[str] = Field(default=None, description="Description of the company")
    posted_date: Optional[datetime.date] = Field(default=None, description="Date the job was posted")
    end_of_application: Optional[datetime.date] = Field(default=None, description="Deadline for applications")
    id_recruiter: Optional[int] = Field(default=None,description="ID of the recruiter posting the job offer")
    skill_ids: Optional[List[int]] = Field(default=None, description="List of skill IDs required for the job")
    soft_skill_ids: Optional[List[int]] = Field(default=None, description="List of soft skill IDs required for the job")
    
class JobOfferRead(SQLModel):
    id: int = Field(..., description="Unique identifier for the job offer")
    job_ref: str = Field(..., max_length=12, description="Unique reference for the job offer")
    title: str = Field(..., max_length=50, description="Title of the job offer")
    job_location: str = Field(..., max_length=100, description="Location of the job")
    salary: Decimal = Field(..., gt=0, description="Salary for the job offer, must be greater than zero")
    description: str = Field(..., description="Detailed description of the job offer")
    company_description: str = Field(..., description="Description of the company")
    posted_date: datetime.date = Field(..., description="Date the job was posted")
    end_of_application: datetime.date = Field(..., description="Deadline for applications")
    id_recruiter: int = Field(..., description="ID of the recruiter posting the job offer")
    skill_ids: Optional[List[int]] = Field(default=None, description="List of skill IDs required for the job")
    soft_skill_ids: Optional[List[int]] = Field(default=None, description="List of soft skill IDs required for the job")

    class Config:
        orm_mode = True