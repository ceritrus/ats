from back.schemas.candidate_schem import CandidateCreate, CandidateRead
from back.services.candidate_service import crud_candidate
from back.api.endpoints.router_base import CRUDRouter
from back.core.config import settings

candidate_crud_router = CRUDRouter(
    service=crud_candidate,
    create_schema=CandidateCreate,
    read_schema=CandidateRead,
    prefix="/candidate",
    tags="Candidate",
    roles=settings.roles_candidate
)