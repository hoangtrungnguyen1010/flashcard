from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from .flashcard import Flashcard

class DeckBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False

class DeckCreate(DeckBase):
    pass

class DeckUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

class DeckInDBBase(DeckBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class Deck(DeckInDBBase):
    pass

class DeckWithFlashcards(Deck):
    flashcards: List[Flashcard] = []
