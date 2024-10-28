from back.db.models.Application import Application, Status
from back.schemas.application_schem import ApplicationRead, ApplicationCreate, ApplicationUpdate
from back.services.crud_base import CRUDBase
from back.db.models.JobOffer import JobOffer
#from back.utils.cv_extractor_utils import process_cv_and_evaluate
from sqlmodel import Session



class CRUDApplication(CRUDBase[Application, ApplicationCreate, ApplicationRead, ApplicationUpdate]):
    def create(self, obj_in: ApplicationCreate, session: Session) -> ApplicationRead:
        job_offer = session.get(JobOffer, obj_in.id_job_offer)
        #ats_prenotation = process_cv_and_evaluate(obj_in.cv_link, job_offer)["score"]
        db_obj = Application(
            status=Status.waiting,
            ats_prenotation=obj_in.ats_prenotation,
            ats_final_note=obj_in.ats_final_note,
            feedback=obj_in.feedback,
            id_candidate=obj_in.id_candidate,
            id_job_offer=obj_in.id_job_offer
        )
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        
        return ApplicationRead.from_orm(db_obj)

crud_application = CRUDApplication(Application, ApplicationRead, ApplicationUpdate)