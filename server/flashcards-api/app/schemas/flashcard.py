from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class FlashcardBase(BaseModel):
    front: str
    back: str
    deck_id: UUID

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardUpdate(BaseModel):
    front: Optional[str] = None
    back: Optional[str] = None
    deck_id: Optional[UUID] = None

class FlashcardInDBBase(FlashcardBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class Flashcard(FlashcardInDBBase):
    pass
