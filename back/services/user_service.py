from back.db.models.User import User
from back.schemas.user_schem import UserRead
from back.services.crud_base import CRUDBase

crud_user = CRUDBase(User, UserRead)