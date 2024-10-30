from back.db.models.Recruiter import Recruiter
from back.schemas.recruiter_schem import RecruiterRead,RecruiterCreate, RecruiterUpdate
from back.services.crud_base import CRUDBase
from sqlmodel import Session, select

class CRUDRecruiter(CRUDBase[Recruiter, RecruiterCreate, RecruiterRead, RecruiterUpdate]):
    def return_role_id(self, user_id:int, session: Session) -> bool:
        statement = select(self.model).where(self.model.id_user == user_id)
        obj = session.exec(statement).first()
        if not obj:
            return None
        else:
            return obj.id

crud_recruiter = CRUDRecruiter(Recruiter, RecruiterRead, RecruiterUpdate)