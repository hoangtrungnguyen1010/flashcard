from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserLogin
from app.core.security import authenticate_user, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", summary="Register a new user")
async def register_user(user: UserCreate):
    # Placeholder: Add logic to save the user to MongoDB
    return {"message": "User registered successfully", "user": user}

@router.post("/login", summary="Login a user")
async def login_user(user: UserLogin):
    # Placeholder: Add logic for user authentication
    user_authenticated = authenticate_user(user.email, user.password)
    if not user_authenticated:
        return {"error": "Invalid credentials"}
    access_token = create_access_token(user.email)
    return {"access_token": access_token, "token_type": "bearer"}
