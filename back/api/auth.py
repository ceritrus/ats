from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from starlette import status
from back.db.models import User
from back.services.user_service import crud_user
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

oauth_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

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
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}

def authenticate_user(username: str, password: str, db_dependency):
        user = crud_user.get_by_username(username, db_dependency)
        if not user:
            return False
        if not verify_password(password, user.password):
            return False
        return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    access: bool = False
    # if get_recruteur_by_user_id(user_id):
    #     access = True
    # else:
    #     access = False
    #Encodage du token avec le username, l'id et l'access
    encode = {'sub': username, 'id': user_id, 'access': access}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITH)


# Methode pour trouver le user à partir du token
async def get_current_user(token: Annotated[str, Depends(oauth_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITH)
        username = str = payload.get('sub')
        user_id = int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')
        return{'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.') 