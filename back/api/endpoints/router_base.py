from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Type, TypeVar, Generic, Callable, List
from back.db.database import get_session
from sqlmodel import SQLModel

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=SQLModel)
ReadSchemaType = TypeVar("ReadSchemaType", bound=SQLModel)

class CRUDRouter(Generic[ModelType, CreateSchemaType, ReadSchemaType]):
    def __init__(
        self,
        service: Callable[..., object],
        create_schema: Type[CreateSchemaType],
        read_schema: Type[ReadSchemaType],
        prefix: str,
        router: APIRouter = APIRouter(),
    ):
        self.service = service
        self.create_schema = create_schema
        self.read_schema = read_schema
        self.router = router
        self.prefix = prefix
        self.generate_routes()

    def generate_routes(self):
        @self.router.post(f"{self.prefix}/create", response_model=self.read_schema)
        def create_item(
            item: self.create_schema, session: Session = Depends(get_session)
        ):
            created_item = self.service.create(item, session)
            return self.read_schema.parse_obj(created_item)

        @self.router.get(f"{self.prefix}/{{item_id}}", response_model=self.read_schema)
        def read_item(item_id: int, session: Session = Depends(get_session)):
            item = self.service.get(item_id, session)
            if item is None:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.read_schema.parse_obj(item)

        @self.router.put(f"{self.prefix}/{{item_id}}", response_model=self.read_schema)
        def update_item(
            item_id: int,
            item: self.create_schema,
            session: Session = Depends(get_session),
        ):
            updated_item = self.service.update(item_id, item, session)
            if updated_item is None:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.read_schema.parse_obj(updated_item)

        @self.router.delete(f"{self.prefix}/{{item_id}}", response_model=dict)
        def delete_item(item_id: int, session: Session = Depends(get_session)):
            success = self.service.delete(item_id, session)
            if not success:
                raise HTTPException(status_code=404, detail="Item not found")
            return {"detail": f"{self.prefix.capitalize()} deleted successfully"}

        @self.router.get(f"{self.prefix}/", response_model=List[self.read_schema])
        def get_all_items(session: Session = Depends(get_session)):
            items = self.service.get_all(session)
            return [self.read_schema.parse_obj(item) for item in items]