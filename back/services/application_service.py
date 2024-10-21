from back.db.models.Application import Application
from back.schemas.application_schem import ApplicationRead
from back.services.crud_base import CRUDBase

crud_application = CRUDBase(Application, ApplicationRead)