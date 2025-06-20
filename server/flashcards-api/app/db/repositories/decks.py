from typing import List, Optional
from sqlalchemy.orm import Session
from uuid import UUID

from .base import BaseRepository
from app.models.deck import Deck
from app.schemas.deck import DeckCreate, DeckUpdate

class DeckRepository(BaseRepository[Deck, DeckCreate, DeckUpdate]):
    def get_by_user(
        self, db: Session, *, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Deck]:
        return (
            db.query(Deck)
            .filter(Deck.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_public_decks(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Deck]:
        return (
            db.query(Deck)
            .filter(Deck.is_public == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_by_name(
        self, db: Session, *, name: str, user_id: UUID
    ) -> Optional[Deck]:
        return (
            db.query(Deck)
            .filter(Deck.name == name, Deck.user_id == user_id)
            .first()
        )
        
    def search(
        self, db: Session, *, query: str, user_id: Optional[UUID] = None, limit: int = 10
    ) -> List[Deck]:
        q = db.query(Deck)
        
        if user_id:
            q = q.filter((Deck.user_id == user_id) | (Deck.is_public == True))
        else:
            q = q.filter(Deck.is_public == True)
            
        return (
            q.filter(
                (Deck.name.ilike(f"%{query}%")) | 
                (Deck.description.ilike(f"%{query}%"))
            )
            .limit(limit)
            .all()
        )

deck_repository = DeckRepository(Deck)
