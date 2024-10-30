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
        # Récupère le JobOffer avec l'identifiant donné
        statement = select(JobOffer).where(JobOffer.id == obj_id)
        db_obj = session.exec(statement).first()
        
        if not db_obj:
            return None

        # Met à jour les champs directs du modèle JobOffer
        for key, value in obj_in.dict(exclude={"skill_ids", "soft_skill_ids"}).items():
            setattr(db_obj, key, value)

        # Met à jour les compétences (skills) en cascade
        if obj_in.skill_ids is not None:
            # Récupère l'ensemble des ids de compétences actuelles
            existing_skill_ids = {skill.skill.id for skill in db_obj.need_to_have_skills}
            # Détermine les compétences à ajouter et à supprimer
            new_skill_ids = set(obj_in.skill_ids)
            skills_to_add = new_skill_ids - existing_skill_ids
            skills_to_remove = existing_skill_ids - new_skill_ids

            # Supprime les compétences qui ne sont plus souhaitées
            db_obj.need_to_have_skills = [
                skill for skill in db_obj.need_to_have_skills if skill.skill.id not in skills_to_remove
            ]
            
            # Ajoute les nouvelles compétences
            if skills_to_add:
                new_skills = session.exec(select(Skill).where(Skill.id.in_(skills_to_add))).all()
                db_obj.need_to_have_skills.extend([NeedToHaveSkill(skill=skill) for skill in new_skills])

        # Met à jour les compétences interpersonnelles (soft skills) en cascade
        if obj_in.soft_skill_ids is not None:
            # Récupère l'ensemble des ids de soft skills actuelles
            existing_soft_skill_ids = {soft_skill.soft_skill.id for soft_skill in db_obj.need_to_have_soft_skills}
            # Détermine les soft skills à ajouter et à supprimer
            new_soft_skill_ids = set(obj_in.soft_skill_ids)
            soft_skills_to_add = new_soft_skill_ids - existing_soft_skill_ids
            soft_skills_to_remove = existing_soft_skill_ids - new_soft_skill_ids

            # Supprime les soft skills qui ne sont plus souhaitées
            db_obj.need_to_have_soft_skills = [
                soft_skill for soft_skill in db_obj.need_to_have_soft_skills if soft_skill.soft_skill.id not in soft_skills_to_remove
            ]

            # Ajoute les nouvelles soft skills
            if soft_skills_to_add:
                new_soft_skills = session.exec(select(SoftSkill).where(SoftSkill.id.in_(soft_skills_to_add))).all()
                db_obj.need_to_have_soft_skills.extend([NeedToHaveSoftSkill(soft_skill=soft_skill) for soft_skill in new_soft_skills])

        # Commit les changements et rafraîchit l'objet
        session.commit()
        session.refresh(db_obj)
        
        return self.read_schema.from_orm(db_obj)

crud_job_offer = CRUDJobOffer(JobOffer, JobOfferRead, JobOfferUpdate)