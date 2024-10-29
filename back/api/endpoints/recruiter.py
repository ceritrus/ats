from back.schemas.recruiter_schem import RecruiterCreate, RecruiterRead, RecruiterUpdate
from back.services.recruiter_service import crud_recruiter
from back.api.endpoints.router_base import CRUDRouter
from back.core.config import settings

recruiter_crud_router = CRUDRouter(
    service=crud_recruiter,
    create_schema=RecruiterCreate,
    read_schema=RecruiterRead,
    update_schema=RecruiterUpdate,
    prefix="/recruiter",
    tags="Recruiter",
    roles=settings.roles_recruiter
)