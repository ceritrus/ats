from fastapi import APIRouter
from back.api.endpoints.user import user_crud_router
from back.api.endpoints.recruiter import recruiter_crud_router
from back.api.endpoints.candidate import candidate_crud_router
from back.api.endpoints.application import application_crud_router
from back.api.endpoints.job_offer import job_offer_crud_router
from back.api.endpoints.skill import skill_crud_router
from back.api.endpoints.soft_skill import soft_skill_crud_router
from back.api.endpoints.file_manager import file_upload_router



api_router = APIRouter()
api_router.include_router(user_crud_router.router)
api_router.include_router(recruiter_crud_router.router)
api_router.include_router(candidate_crud_router.router)
api_router.include_router(application_crud_router.router)
api_router.include_router(job_offer_crud_router.router)
api_router.include_router(skill_crud_router.router)
api_router.include_router(soft_skill_crud_router.router)
api_router.include_router(file_upload_router)

