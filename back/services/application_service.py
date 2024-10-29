from back.db.models.Application import Application, Status
from back.schemas.application_schem import ApplicationRead, ApplicationCreate, ApplicationUpdate
from back.services.crud_base import CRUDBase
from back.db.models.JobOffer import JobOffer
from back.utils.cv_extractor_utils import extractor
from back.utils.openai_utils import evaluator
from sqlmodel import Session



class CRUDApplication(CRUDBase[Application, ApplicationCreate, ApplicationRead, ApplicationUpdate]):
    def create(self, obj_in: ApplicationCreate, session: Session) -> ApplicationRead:
        job_offer = session.get(JobOffer, obj_in.id_job_offer)
        extractor_object = extractor.calculate_score(job_offer,obj_in.cv_link)
        ats_prenotation = extractor_object["final_score"]
        ats_final_note = evaluator.chatty_estimate(extractor_object)
        db_obj = Application(
            status=Status.waiting,
            ats_prenotation=ats_prenotation,
            ats_final_note=ats_final_note,
            cv_link=obj_in.cv_link,
            feedback=obj_in.feedback,
            applicant_message=obj_in.applicant_message,
            id_candidate=obj_in.id_candidate,
            id_job_offer=obj_in.id_job_offer
        )
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        
        return ApplicationRead.from_orm(db_obj)

crud_application = CRUDApplication(Application, ApplicationRead, ApplicationUpdate)