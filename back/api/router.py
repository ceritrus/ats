from fastapi import APIRouter
from back.api.endpoints.user import user_crud_router

api_router = APIRouter()
api_router.include_router(user_crud_router.router)