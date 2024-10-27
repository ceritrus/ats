from back.db.models.Skill import Skill
from back.schemas.skill_schem import SkillRead, SkillUpdate
from back.services.crud_base import CRUDBase

crud_skill = CRUDBase(Skill, SkillRead, SkillUpdate)