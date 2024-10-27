from datetime import datetime
from math import ceil
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, Field, create_model
from sqlmodel import Session
from typing import Type, TypeVar, Generic, Callable, List, Optional, Dict, Any, Union
from back.db.database import get_session
from sqlmodel import SQLModel
from back.api.auth import role_required

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=SQLModel)
ReadSchemaType = TypeVar("ReadSchemaType", bound=SQLModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=SQLModel)

def generate_example(create_schema: Type[BaseModel]) -> Dict[str, Any]:
    example = {}
    
    for field_name, field_info in create_schema.__fields__.items():
        field_type = field_info.annotation
        if field_type == str:
            example[field_name] = "exemple"  
        elif field_type == int:
            example[field_name] = 1 
        elif field_type == float:
            example[field_name] = 1.0 
        elif field_type == bool:
            example[field_name] = True  
        elif field_type == List[str]: 
            example[field_name] = ["exemple_item"] 
        elif field_type == Union[str, None]: 
            example[field_name] = "exemple"  
        elif field_type == Union[float, str, None]: 
            example[field_name] = "exemple"  
        elif field_type == Optional[str]:
            example[field_name] = "exemple"
        elif field_type == List[int]: 
            example[field_name] = [1, 2, 3]
        elif field_type == Optional[List[int]]:
            example[field_name] = [1, 2, 3]  
        elif field_type == str or field_type == Optional[str]:
            example[field_name] = "exemple" 
        elif field_type == datetime:  
            example[field_name] = datetime.now().isoformat() 
        else:
            example[field_name] = "exemple" 

    return example

def generate_field_example(create_schema: Type[BaseModel]) -> List[str]:
    schema = create_schema.schema()
    example_fields = []
    
    for field_name in schema.get("properties", {}).keys():
        example_fields.append(field_name)  
        
    return example_fields

def create_search_query_model(create_schema: Type[BaseModel], tags) -> Type[BaseModel]:
    example_query = generate_example(create_schema)
    example_fields = generate_field_example(create_schema)
    return create_model(
        'SearchQuery' + tags,
        query=(Dict[str, Any], Field(..., example=example_query)),
        fields=(List[str], Field(..., example=example_fields)),
        limit=(int, Field(10, example=10)),
        offset=(int, Field(0, example=0)),
        exact=(bool, Field(False, example=False)),
        sort_by=(Optional[str], Field(None, example="Optional sort field")),
        order=(str, Field("asc", example="asc or desc"))
    )

class CRUDRouter(Generic[ModelType, CreateSchemaType, ReadSchemaType, UpdateSchemaType]):
    def __init__(
        self,
        tags: str,
        service: Callable[..., object],
        create_schema: Type[CreateSchemaType],
        read_schema: Type[ReadSchemaType],
        update_schema: Type[UpdateSchemaType], 
        prefix: str,
        router: APIRouter = APIRouter(),
        create_callback: Optional[Callable[..., object]] = None,
        roles: Dict[str, List[str]] = None
    ):
        self.service = service
        self.tags = tags
        self.create_schema = create_schema
        self.read_schema = read_schema
        self.update_schema = update_schema 
        self.router = router
        self.prefix = prefix
        self.create_callback = create_callback
        self.roles = roles or {}

        self.search_query_model = create_search_query_model(create_schema, self.tags)

        self.generate_routes()
        
    def generate_routes(self):
        @self.router.get(
            f"{self.prefix}/paginated", 
            response_model=Dict[str, Any], 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("get_paginated")))]  
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
            dependencies=[Depends(role_required(self.roles.get("create")))]  
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
            dependencies=[Depends(role_required(self.roles.get("search")))]  
        )
        def search_items(query: str, field: Optional[str], session: Session = Depends(get_session)):
            if not query:
                raise HTTPException(status_code=400, detail="Search query not provided")
            results = self.service.search(query, session, field)
            return [self.read_schema.from_orm(item) for item in results]
        
        @self.router.post(
            f"{self.prefix}/search_paginated", 
            response_model=Dict[str, Any], 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("search_paginated")))]
        )
        def search_paginated_items(
            search_query: self.search_query_model,
            session: Session = Depends(get_session)
        ):
            if not search_query.query:
                raise HTTPException(status_code=400, detail="Search query not provided")
            
            search_results = self.service.search_improved(
                search_query.query, session, search_query.fields, search_query.exact
            )
            if search_query.sort_by:
                search_results.sort(key=lambda item: getattr(item, search_query.sort_by), reverse=(search_query.order == "desc"))

            paginated_results = search_results[search_query.offset:search_query.offset + search_query.limit]

            total_items = len(search_results) 
            total_pages = ceil(total_items / search_query.limit)

            return {
                "items": paginated_results,
                "total_items": total_items,
                "total_pages": total_pages,
                "current_page": (search_query.offset // search_query.limit) + 1,
                "page_size": search_query.limit
            }

        @self.router.get(
            f"{self.prefix}/{{item_id}}", 
            response_model=self.read_schema, 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("read")))]  
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
            dependencies=[Depends(role_required(self.roles.get("update")))]
        )
        def update_item(
            item_id: int,
            item: self.update_schema, 
            session: Session = Depends(get_session),
        ):
            print(f"Updating item with ID {item_id} and data {item}")
            updated_item = self.service.update(item_id, item, session)
            if updated_item is None:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.read_schema.from_orm(updated_item)
        @self.router.delete(
            f"{self.prefix}/{{item_id}}", 
            response_model=dict, 
            tags=[self.tags],
            dependencies=[Depends(role_required(self.roles.get("delete")))]  
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
            dependencies=[Depends(role_required(self.roles.get("get_all")))]  
        )
        def get_all_items(session: Session = Depends(get_session)):
            items = self.service.get_all(session)
            return [self.read_schema.from_orm(item) for item in items]