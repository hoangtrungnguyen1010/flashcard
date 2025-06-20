from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from helper import PyObjectId
from bson import ObjectId

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    username: str
    hashed_password: str
    is_active: bool = True
    flashcard_lists: Optional[List[str]] = []

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "user123",
                "hashed_password": "hashedpassword",
                "is_active": True,
                "flashcard_lists": ["deck1_id", "deck2_id"],
            }
        }
