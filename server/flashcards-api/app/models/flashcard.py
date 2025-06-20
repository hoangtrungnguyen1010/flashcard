from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from helper import PyObjectId

class Flashcard(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    question: str
    answer: str
    user_id: PyObjectId
    deck_id: Optional[PyObjectId] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "question": "What is FastAPI?",
                "answer": "A Python framework for building APIs",
                "user_id": "60f7f0d8f1d3f82b2a4e8301",
                "deck_id": "60f7f0d8f1d3f82b2a4e8304",
            }
        }
