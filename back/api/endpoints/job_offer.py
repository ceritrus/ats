from back.schemas.job_offer_schem import JobOfferCreate, JobOfferRead
from back.services.job_offer_service import crud_job_offer
from back.api.endpoints.router_base import CRUDRouter

job_offer_crud_router = CRUDRouter(
    service=crud_job_offer,
    create_schema=JobOfferCreate,
    read_schema=JobOfferRead,
    prefix="/job-offer",
    tags="Job Offer"
)