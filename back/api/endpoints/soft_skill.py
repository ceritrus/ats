from back.schemas.soft_skill_schem import SoftSkillCreate, SoftSkillRead
from back.services.soft_skill_service import crud_soft_skill
from back.api.endpoints.router_base import CRUDRouter
from back.core.config import settings

soft_skill_crud_router = CRUDRouter(
    service=crud_soft_skill,
    create_schema=SoftSkillCreate,
    read_schema=SoftSkillRead,
    prefix="/soft-skill",
    tags="Soft Skill",
    roles=settings.roles_soft_skill
)