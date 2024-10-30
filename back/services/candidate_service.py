from back.db.models.Candidate import Candidate
from back.schemas.candidate_schem import CandidateRead, CandidateUpdate, CandidateCreate
from back.services.crud_base import CRUDBase
from sqlmodel import Session, select

class CRUDRecruiter(CRUDBase[Candidate, CandidateCreate, CandidateRead, CandidateUpdate]):
    def return_role_id(self, user_id:int, session: Session) -> bool:
        statement = select(self.model).where(self.model.id_user == user_id)
        obj = session.exec(statement).first()
        if not obj:
            return None
        else:
            return obj.id

crud_candidate = CRUDRecruiter(Candidate, CandidateRead, CandidateUpdate)