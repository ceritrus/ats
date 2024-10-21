from sqlmodel import Session, select
from back.db.models import User
from back.schemas.user_schem import UserCreate, UserRead

def create_user(user: UserCreate, session: Session) -> UserRead:
    db_user = User.model_validate(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return UserRead.model_validate(db_user)

def read_user(user_id: int, session: Session) -> UserRead:
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    return UserRead.model_validate(user) if user else None

def update_user(user_id: int, user_data: UserCreate, session: Session) -> UserRead:
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    if user:
        user.username = user_data.username
        user.email = user_data.email
        session.commit()
        session.refresh(user)
        return UserRead.model_validate(user)
    return None

def delete_user(user_id: int, session: Session) -> bool:
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    if user:
        session.delete(user)
        session.commit()
        return True
    return False