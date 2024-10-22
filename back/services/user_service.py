from sqlmodel import Session, select
from back.db.models.User import User
from back.schemas.user_schem import UserRead, UserCreate
from back.services.crud_base import CRUDBase
from back.utils.password_utils import hash_password
from typing import Optional

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
    
    def get_by_username(self, obj_username: str, session: Session) -> Optional[UserRead]:
        statement = select(self.model).where(self.model.username == obj_username)
        obj = session.exec(statement).first()
        return self.read_schema.from_orm(obj) if obj else None

crud_user = CRUDUser(User, UserRead)