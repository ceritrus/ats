from sqlmodel import Session
from back.db.models.User import User
from back.schemas.user_schem import UserRead, UserCreate
from back.services.crud_base import CRUDBase
from back.utils.password_utils import hash_password

class CRUDUser(CRUDBase[User, UserCreate, UserRead]):
    def create(self, obj_in: UserCreate, session: Session) -> UserRead:
        hashed_password = hash_password(obj_in.password)
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            password=hashed_password
        )
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return self.read_schema.from_orm(db_obj)

crud_user = CRUDUser(User, UserRead)