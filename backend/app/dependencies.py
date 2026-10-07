from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from .core.config import settings
from .core.database import get_db
from . import models, schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_recruiter(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not enough permissions. Recruiter required.")
    return current_user

def get_current_candidate(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.RoleEnum.CANDIDATE:
        raise HTTPException(status_code=403, detail="Not enough permissions. Candidate required.")
    return current_user
