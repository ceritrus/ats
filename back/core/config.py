from pydantic_settings import BaseSettings
from typing import  List, Dict

import os

class Settings(BaseSettings):
    OPENAI_KEY: str
    PROJECT_NAME : str = "ATS With AI"
    ALLOWED_HOSTS: list = ['*']
    DATABASE_URL: str = "sqlite:///./ats.db"
    UPLOAD_DIR: str = "uploads"


    #Roles def for endpoints. Value is [], ["Recruiter"], ["Candidate"], ["Recruiter", "Candidate"]
    
    roles_application:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }
    roles_candidate:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }
    roles_job_offer:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }
    roles_recruiter:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }
    roles_skill:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }
    roles_soft_skill:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }
    roles_user:Dict[str, List[str]] = {       
        "create": [],
        "read": [],               
        "update": [],   
        "delete": [],   
        "get_all": [],            
        "get_paginated": [],      
        "search": [],             
    }      
    class Config:
        env_file = "back/core/.env"

settings = Settings()