from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from . import models
from .routers import auth, jobs

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobTrust AI Backend (Phase 1)")

# Security: CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to FRONTEND_URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(jobs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to JobTrust AI API - Phase 1"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
