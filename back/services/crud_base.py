from typing import Type, TypeVar, Generic, List, Optional
from sqlmodel import SQLModel, Session, select
from back.utils.lefenshtein_utils import levenshtein
from math import ceil
from typing import Dict, Any
from sqlalchemy import func

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=SQLModel)
ReadSchemaType = TypeVar("ReadSchemaType", bound=SQLModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, ReadSchemaType]):
    def __init__(self, model: Type[ModelType], read_schema: Type[ReadSchemaType]):
        self.model = model
        self.read_schema = read_schema  

    def create(self, obj_in: CreateSchemaType, session: Session) -> ReadSchemaType:
        db_obj = self.model(**obj_in.dict())
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return self.read_schema.from_orm(db_obj)

    def get(self, obj_id: int, session: Session) -> Optional[ReadSchemaType]:
        statement = select(self.model).where(self.model.id == obj_id)
        obj = session.exec(statement).first()
        return self.read_schema.from_orm(obj) if obj else None

    def get_all(self, session: Session) -> List[ReadSchemaType]:
        statement = select(self.model)
        objs = session.exec(statement).all()
        return [self.read_schema.from_orm(obj) for obj in objs]
    
    def get_paginated(self, session: Session, limit: int = 10, offset: int = 0) -> Dict[str, Any]:
        total_items_statement = select(func.count()).select_from(self.model)
        total_items = session.exec(total_items_statement).first()
        total_pages = ceil(total_items / limit)

        statement = select(self.model).offset(offset).limit(limit)
        objs = session.exec(statement).all()

        if not objs:
            return {
                "items": [],
                "total_items": total_items,
                "total_pages": total_pages,
                "current_page": (offset // limit) + 1,
                "page_size": limit
            }

        items = [self.read_schema.from_orm(obj) for obj in objs]

        return {
            "items": items,
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": (offset // limit) + 1,
            "page_size": limit
        }
    
    def update(self, obj_id: int, obj_in: CreateSchemaType, session: Session) -> Optional[ReadSchemaType]:
        statement = select(self.model).where(self.model.id == obj_id)
        db_obj = session.exec(statement).first()
        if db_obj:
            for key, value in obj_in.dict().items():
                setattr(db_obj, key, value)
            session.commit()
            session.refresh(db_obj)
            return self.read_schema.from_orm(db_obj)
        return None

    def delete(self, obj_id: int, session: Session) -> bool:
        statement = select(self.model).where(self.model.id == obj_id)
        db_obj = session.exec(statement).first()
        if db_obj:
            session.delete(db_obj)
            session.commit()
            return True
        return False
    def search(self, search_term: str, session: Session, field: Optional[str] = None) -> List[ReadSchemaType]:
        statement = select(self.model)
        results = session.exec(statement).all()

        matching_results = []

        for obj in results:
            if field:
                if hasattr(obj, field):
                    value = getattr(obj, field)
                    if isinstance(value, str):
                        distance = levenshtein(value, search_term)
                        if distance <= 2:
                            matching_results.append(obj)
            else:
                for obj_field in obj.__dict__:
                    if not obj_field.startswith("_"):  
                        value = getattr(obj, obj_field)
                        if isinstance(value, str):
                            distance = levenshtein(value, search_term)
                            if distance <= 2:
                                matching_results.append(obj)
                                break
                            
        return [self.read_schema.from_orm(obj) for obj in matching_results]

    def get_levenshtein_distance(self, obj_id: int, session: Session, reference_word: str) -> Optional[int]:
        statement = select(self.model).where(self.model.id == obj_id)
        db_obj = session.exec(statement).first()
        if db_obj:
            return levenshtein(db_obj.name, reference_word)
        return None
    def search_improved(
        self, 
        query: Dict[str, Any], 
        session: Session, 
        fields: List[str], 
        exact: bool = False,
        sort_by: Optional[str] = None,
        order: str = "asc"
    ) -> List[ReadSchemaType]:

        statement = select(self.model)
        results = session.exec(statement).all()

        matching_results = []

        for obj in results:
            is_match = True

            for field, value in query.items():
                if field in fields:
                    if hasattr(obj, field):
                        obj_value = getattr(obj, field)

                        if obj_value is None:
                            is_match = False
                            continue

                        if isinstance(value, list):
                            if exact:
                                if obj_value not in value:
                                    is_match = False
                                    break
                            else:
                                if not any(levenshtein(str(obj_value), str(v)) <= 2 for v in value):
                                    is_match = False
                                    break
                        else:
                            if isinstance(value, int) and isinstance(obj_value, int):
                                if exact:
                                    if obj_value != value:
                                        is_match = False
                                        break
                                else:
                                    if obj_value != value:
                                        is_match = False
                                        break
                            elif isinstance(obj_value, str):
                                if exact:
                                    if obj_value != str(value):
                                        is_match = False
                                        break
                                else:
                                    distance = levenshtein(obj_value, str(value))
                                    if distance > 2:
                                        is_match = False
                                        break

            if is_match:
                matching_results.append(obj)

        if sort_by and hasattr(self.model, sort_by):
            matching_results.sort(key=lambda obj: getattr(obj, sort_by), reverse=(order == "desc"))

        return [self.read_schema.from_orm(obj) for obj in matching_results]