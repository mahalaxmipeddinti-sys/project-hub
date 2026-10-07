from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..core.database import get_db
from ..dependencies import get_current_recruiter, get_current_candidate

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("/", response_model=List[schemas.JobOut])
def list_jobs(db: Session = Depends(get_db), limit: int = 50):
    # Anyone can view active jobs
    jobs = db.query(models.Job).filter(models.Job.status == models.JobStatusEnum.ACTIVE).limit(limit).all()
    return jobs

@router.post("/", response_model=schemas.JobOut)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_recruiter)):
    # Recruiter only
    recruiter_profile = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.user_id == current_user.id).first()
    
    new_job = models.Job(**job.model_dump(), recruiter_id=recruiter_profile.id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.post("/{job_id}/apply", response_model=schemas.ApplicationOut)
def apply_to_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_candidate)):
    # Candidate only
    candidate_profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job or job.status != models.JobStatusEnum.ACTIVE:
        raise HTTPException(status_code=404, detail="Job not found or not active")
        
    # Prevent duplicate applications
    existing_app = db.query(models.Application).filter(
        models.Application.job_id == job_id,
        models.Application.candidate_id == candidate_profile.id
    ).first()
    
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied to this job")
        
    new_app = models.Application(job_id=job_id, candidate_id=candidate_profile.id)
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app
