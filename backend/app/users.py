from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
import time, os
from app.database import users_collection


router = APIRouter()
SECRET = os.getenv("JWT_SECRET", "fallback_secret_please_change")
auth_scheme = HTTPBearer()

@router.get("/users/me")
def get_user(credentials = Depends(auth_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        if payload.get("exp") < time.time():
            raise HTTPException(status_code=401, detail="Token expired")
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = users_collection.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "name": user.get("name"),
            "username": user.get("username")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
