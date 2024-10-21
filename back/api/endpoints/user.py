from back.db.models import User
from back.schemas.user_schem import UserCreate, UserRead
from back.services.user_service import crud_user
from back.api.endpoints.router_base import CRUDRouter
from fastapi import FastAPI


user_router = CRUDRouter(
    service=crud_user,
    create_schema=UserCreate,
    read_schema=UserRead,
    prefix="/users"
)