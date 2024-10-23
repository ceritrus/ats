from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Type, TypeVar, Generic, Callable, List, Optional, Dict, Any
from back.db.database import get_session
from sqlmodel import SQLModel
from back.api.auth import role_required

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=SQLModel)
ReadSchemaType = TypeVar("ReadSchemaType", bound=SQLModel)

class CRUDRouter(Generic[ModelType, CreateSchemaType, ReadSchemaType]):
    def __init__(
        self,
        tags: str,
        service: Callable[..., object],
        create_schema: Type[CreateSchemaType],
        read_schema: Type[ReadSchemaType],
        prefix: str,
        router: APIRouter = APIRouter(),
        create_callback: Optional[Callable[..., object]] = None,
        roles: Dict[str, List[str]] = None  # Dictionary to specify roles per route
    ):
        self.service = service
        self.tags = tags
        self.create_schema = create_schema
        self.read_schema = read_schema
        self.router = router
        self.prefix = prefix
        self.create_callback = create_callback 
        self.roles = roles or {}
        self.generate_routes()
        
    def generate_routes(self):
        @self.router.get(
            f"{self.prefix}/paginated", 
            response_model=Dict[str, Any], 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("get_paginated")))]  # Dépendances selon les rôles
        )
        def get_paginated_items(
            limit: int = 10, 
            offset: int = 0, 
            session: Session = Depends(get_session)
        ):
            paginated_result = self.service.get_paginated(session, limit=limit, offset=offset)
            return {
                "items": paginated_result["items"],
                "total_items": paginated_result["total_items"],
                "total_pages": paginated_result["total_pages"],
                "current_page": paginated_result["current_page"],
                "page_size": paginated_result["page_size"],
            }
        
        @self.router.post(
            f"{self.prefix}/create", 
            response_model=self.read_schema, 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("create")))]  # Restriction selon les rôles
        )
        def create_item(
            item: self.create_schema, session: Session = Depends(get_session)
        ):
            if self.create_callback: 
                return self.create_callback(item, session)
            created_item = self.service.create(item, session)
            return self.read_schema.from_orm(created_item)
        
        @self.router.get(
            f"{self.prefix}/search", 
            response_model=List[self.read_schema], 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("search")))]  # Dépendances selon les rôles
        )
        def search_items(query: str, field: Optional[str], session: Session = Depends(get_session)):
            if not query:
                raise HTTPException(status_code=400, detail="Search query not provided")
            results = self.service.search(query, session, field)
            return [self.read_schema.from_orm(item) for item in results]
        
        @self.router.get(
            f"{self.prefix}/{{item_id}}", 
            response_model=self.read_schema, 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("read")))]  # Dépendances selon les rôles
        )
        def read_item(item_id: int, session: Session = Depends(get_session)):
            item = self.service.get(item_id, session)
            if item is None:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.read_schema.from_orm(item)

        @self.router.put(
            f"{self.prefix}/{{item_id}}", 
            response_model=self.read_schema, 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("update")))]  # Dépendances selon les rôles
        )
        def update_item(
            item_id: int,
            item: self.create_schema,
            session: Session = Depends(get_session),
        ):
            updated_item = self.service.update(item_id, item, session)
            if updated_item is None:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.read_schema.from_orm(updated_item)

        @self.router.delete(
            f"{self.prefix}/{{item_id}}", 
            response_model=dict, 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("delete")))]  # Dépendances selon les rôles
        )
        def delete_item(item_id: int, session: Session = Depends(get_session)):
            success = self.service.delete(item_id, session)
            if not success:
                raise HTTPException(status_code=404, detail="Item not found")
            return {"detail": f"{self.prefix.capitalize()} deleted successfully"}

        @self.router.get(
            f"{self.prefix}/", 
            response_model=List[self.read_schema], 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("get_all")))]  # Dépendances selon les rôles
        )
        def get_all_items(session: Session = Depends(get_session)):
            items = self.service.get_all(session)
            return [self.read_schema.from_orm(item) for item in items]