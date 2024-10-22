from back.schemas.recruiter_schem import RecruiterCreate, RecruiterRead
from back.services.recruiter_service import crud_recruiter
from back.api.endpoints.router_base import CRUDRouter

recruiter_crud_router = CRUDRouter(
    service=crud_recruiter,
    create_schema=RecruiterCreate,
    read_schema=RecruiterRead,
    prefix="/recruiter",
    tags="Recruiter"
)