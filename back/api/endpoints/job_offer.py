from back.schemas.job_offer_schem import JobOfferCreate, JobOfferRead, JobOfferUpdate
from back.services.job_offer_service import crud_job_offer
from back.api.endpoints.router_base import CRUDRouter
from back.core.config import settings

job_offer_crud_router = CRUDRouter(
    service=crud_job_offer,
    create_schema=JobOfferCreate,
    read_schema=JobOfferRead,
    update_schema=JobOfferUpdate,
    prefix="/job-offer",
    tags="Job Offer",
    roles=settings.roles_job_offer
)