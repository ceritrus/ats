from back.db.models.SoftSkill import SoftSkill
from back.schemas.soft_skill_schem import SoftSkillRead, SoftSkillUpdate
from back.services.crud_base import CRUDBase

crud_soft_skill = CRUDBase(SoftSkill, SoftSkillRead, SoftSkillUpdate)