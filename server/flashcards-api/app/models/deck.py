from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from helper import PyObjectId

class Deck(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: Optional[str] = None
    user_id: PyObjectId
    flashcards: Optional[List[PyObjectId]] = []

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "My Deck",
                "description": "This is a sample deck",
                "user_id": "60f7f0d8f1d3f82b2a4e8301",
                "flashcards": ["60f7f0d8f1d3f82b2a4e8302", "60f7f0d8f1d3f82b2a4e8303"],
            }
        }
