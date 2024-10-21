from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from back.db.database import get_session
from back.services import user_service
from back.schemas.user_schem import UserCreate, UserRead

router = APIRouter()

@router.post("/users/", response_model=UserRead)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    return user_service.create_user(user, session)

@router.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = user_service.read_user(user_id, session)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, user: UserCreate, session: Session = Depends(get_session)):
    updated_user = user_service.update_user(user_id, user, session)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.delete_user(user_id, session)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}