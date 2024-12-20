from back.schemas.application_schem import ApplicationCreate, ApplicationRead, ApplicationUpdate
from back.services.application_service import crud_application
from back.api.endpoints.router_base import CRUDRouter
from back.core.config import settings

application_crud_router = CRUDRouter(
    service=crud_application,
    create_schema=ApplicationCreate,
    read_schema=ApplicationRead,
    update_schema=ApplicationUpdate,
    prefix="/application",
    tags="Application",
    roles = settings.roles_application
)