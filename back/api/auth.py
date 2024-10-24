from datetime import timedelta, datetime
from typing import Annotated, Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlmodel import Session
from starlette import status
from back.db.models import User
from back.services.user_service import crud_user
from back.services.recruiter_service import crud_recruiter
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from back.utils.password_utils import verify_password
from back.db.database import get_session

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = '196dz55ssgzbba6x1'
ALGORITH = 'HS256'


class OAuth2PasswordBearerOptional(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.headers.get("Authorization")
        if authorization:
            return await super().__call__(request)
        return None
oauth_bearer_optional  = OAuth2PasswordBearerOptional(tokenUrl='/api/auth/token')

class Token(BaseModel):
    access_token: str
    token_type: str

db_dependency = Annotated[Session, Depends(get_session)]

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 session: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    token = create_access_token(user.username, user.id, timedelta(minutes=20), session)
    return {'access_token': token, 'token_type': 'bearer'}

def authenticate_user(username: str, password: str, db_dependency):
    user = crud_user.get_by_username(username, db_dependency)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta, db_dependency):
    access: str
    if crud_recruiter.check_if_recruiter(user_id, db_dependency):
        access = "Recruiter"
    else:
        access = "Candidate"
    encode = {'sub': username, 'id': user_id, 'role': access}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITH)

async def get_current_user_or_none(token: Optional[str] = Depends(oauth_bearer_optional)):
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITH])
        username = payload.get('sub')
        user_id = payload.get('id')
        user_role = payload.get('role')
        
        if username is None or user_id is None:
            return None
        
        return {'username': username, 'id': user_id, 'role': user_role}
    except JWTError:
        return None

def role_required(allowed_roles: Optional[List[str]] = None):
    async def dependency(user: Annotated[Optional[dict], Depends(get_current_user_or_none)] = None):
        if allowed_roles is None or len(allowed_roles) == 0:
            return
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )
        
        user_role = user.get('role')
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden: Unauthorized role"
            )
    return dependency