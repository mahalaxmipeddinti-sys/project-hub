from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import RoleEnum, JobStatusEnum, ApplicationStatusEnum

# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum
    
    class Config:
        from_attributes = True

# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    employment_type: str
    experience_required: int = 0
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    recruiter_id: int
    status: JobStatusEnum
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationOut(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: ApplicationStatusEnum
    applied_at: datetime
    
    class Config:
        from_attributes = True
