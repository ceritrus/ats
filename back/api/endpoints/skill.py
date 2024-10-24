from back.schemas.skill_schem import SkillCreate, SkillRead
from back.services.skill_service import crud_skill
from back.api.endpoints.router_base import CRUDRouter
from back.core.config import settings

skill_crud_router = CRUDRouter(
    service=crud_skill,
    create_schema=SkillCreate,
    read_schema=SkillRead,
    prefix="/skill",
    tags="Skill",
    roles=settings.roles_skill
)