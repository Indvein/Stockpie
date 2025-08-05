from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.hash import bcrypt
from jose import jwt
import os
import time
from app.database import users_collection

router = APIRouter()
SECRET = os.getenv("JWT_SECRET", "fallback_secret_please_change")

class RegisterRequest(BaseModel):
    name: str
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register_user(user: RegisterRequest):
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = bcrypt.hash(user.password)
    users_collection.insert_one({
        "name": user.name,
        "username": user.username,
        "password": hashed_password
    })
    return {"message": "User registered successfully"}

@router.post("/login")
def login_user(user: LoginRequest):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    payload = {
        "sub": user.username,
        "exp": time.time() + 3600
    }
    token = jwt.encode(payload, SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}
