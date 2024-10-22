from back.schemas.application_schem import ApplicationCreate, ApplicationRead
from back.services.application_service import crud_application
from back.api.endpoints.router_base import CRUDRouter

application_crud_router = CRUDRouter(
    service=crud_application,
    create_schema=ApplicationCreate,
    read_schema=ApplicationRead,
    prefix="/application",
    tags="Application"
)