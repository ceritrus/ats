from back.db.models.Recruiter import Recruiter
from back.schemas.recruiter_schem import RecruiterRead
from back.services.crud_base import CRUDBase

crud_recruiter = CRUDBase(Recruiter, RecruiterRead)