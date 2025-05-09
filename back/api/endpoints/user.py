from back.schemas.user_schem import UserCreate, UserRead, UserUpdate
from back.services.user_service import crud_user
from back.api.endpoints.router_base import CRUDRouter
from sqlmodel import Session
from back.core.config import settings

def custom_create_user(item: UserCreate, session: Session) -> UserRead:    
    created_user = crud_user.create(item, session)
    return UserRead.from_orm(created_user)

user_crud_router = CRUDRouter(
    service=crud_user,
    create_schema=UserCreate,
    read_schema=UserRead,
    update_schema=UserUpdate,
    prefix="/user",
    tags="User",
    create_callback=custom_create_user,
    roles=settings.roles_user
)