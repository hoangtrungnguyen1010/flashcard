from typing import List, Optional
from sqlalchemy.orm import Session
from uuid import UUID

from .base import BaseRepository
from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardCreate, FlashcardUpdate

class FlashcardRepository(BaseRepository[Flashcard, FlashcardCreate, FlashcardUpdate]):
    def get_by_user(
        self, db: Session, *, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Flashcard]:
        return (
            db.query(Flashcard)
            .filter(Flashcard.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_by_deck(
        self, db: Session, *, deck_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Flashcard]:
        return (
            db.query(Flashcard)
            .filter(Flashcard.deck_id == deck_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def search(
        self, db: Session, *, query: str, user_id: Optional[UUID] = None, limit: int = 10
    ) -> List[Flashcard]:
        q = db.query(Flashcard)
        
        if user_id:
            q = q.filter(Flashcard.user_id == user_id)
            
        return (
            q.filter(
                (Flashcard.front.ilike(f"%{query}%")) | 
                (Flashcard.back.ilike(f"%{query}%"))
            )
            .limit(limit)
            .all()
        )

flashcard_repository = FlashcardRepository(Flashcard)
