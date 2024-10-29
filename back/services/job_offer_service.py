from back.db.models.JobOffer import JobOffer
from back.db.models.NeedToHaveSkill import NeedToHaveSkill
from back.db.models.NeedToHaveSoftSkill import NeedToHaveSoftSkill
from back.schemas.job_offer_schem import JobOfferRead, JobOfferCreate, JobOfferUpdate
from sqlmodel import Session, select
from back.services.crud_base import CRUDBase
from back.db.models.Skill import Skill
from back.db.models.SoftSkill import SoftSkill

from typing import Optional

class CRUDJobOffer(CRUDBase[JobOffer, JobOfferCreate, JobOfferRead, JobOfferUpdate]):
    def create(self, obj_in: JobOfferCreate, session: Session) -> JobOfferRead:
        db_obj = JobOffer(**obj_in.dict(exclude={"skill_ids", "soft_skill_ids"}))

        if obj_in.skill_ids:
            skills = session.exec(select(Skill).where(Skill.id.in_(obj_in.skill_ids))).all()
            for skill in skills:
                need_to_have_skill = NeedToHaveSkill(id_job_offer=db_obj.id, id_skill=skill.id)
                db_obj.need_to_have_skills.append(need_to_have_skill)

        if obj_in.soft_skill_ids:
            soft_skills = session.exec(select(SoftSkill).where(SoftSkill.id.in_(obj_in.soft_skill_ids))).all()
            for soft_skill in soft_skills:
                need_to_have_soft_skill = NeedToHaveSoftSkill(id_job_offer=db_obj.id, id_soft_skill=soft_skill.id)
                db_obj.need_to_have_soft_skills.append(need_to_have_soft_skill)

        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return self.read_schema.from_orm(db_obj)

    def update(self, obj_id: int, obj_in: JobOfferCreate, session: Session) -> Optional[JobOfferRead]:
        statement = select(JobOffer).where(JobOffer.id == obj_id)
        db_obj = session.exec(statement).first()
        if not db_obj:
            return None

        for key, value in obj_in.dict(exclude={"skill_ids", "soft_skill_ids"}).items():
            setattr(db_obj, key, value)

        if obj_in.skill_ids is not None:
            skills = session.exec(select(Skill).where(Skill.id.in_(obj_in.skill_ids))).all()
            db_obj.skills = skills  

        if obj_in.soft_skill_ids is not None:
            soft_skills = session.exec(select(SoftSkill).where(SoftSkill.id.in_(obj_in.soft_skill_ids))).all()
            db_obj.soft_skills = soft_skills 

        session.commit()
        session.refresh(db_obj)
        return self.read_schema.from_orm(db_obj)

crud_job_offer = CRUDJobOffer(JobOffer, JobOfferRead, JobOfferUpdate)