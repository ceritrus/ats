from back.db.models.Candidate import Candidate
from back.schemas.candidate_schem import CandidateRead, CandidateUpdate
from back.services.crud_base import CRUDBase

crud_candidate = CRUDBase(Candidate, CandidateRead, CandidateUpdate)