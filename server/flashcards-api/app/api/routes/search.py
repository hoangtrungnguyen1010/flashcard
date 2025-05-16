from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Any, Optional
from uuid import UUID

from app import schemas
from app.api import deps
from app.db.repositories import user_repository, flashcard_repository, deck_repository
from app.models.user import User
from app.config import settings

router = APIRouter(prefix=f"{settings.API_V1_STR}/search", tags=["search"])

@router.get("", response_model=schemas.SearchResults)
def search(
    *,
    db: Session = Depends(deps.get_db),
    query: str = Query(..., min_length=1),
    include_users: bool = True,
    include_decks: bool = True,
    include_flashcards: bool = True,
    limit: int = 10,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Search across flashcards, decks, and users.
    """
    results = schemas.SearchResults()
    
    if include_flashcards:
        results.flashcards = flashcard_repository.search(
            db, query=query, user_id=current_user.id, limit=limit
        )
    
    if include_decks:
        results.decks = deck_repository.search(
            db, query=query, user_id=current_user.id, limit=limit
        )
    
    # For users search, we only search if there's an admin flag on the current user
    # This is a simplified approach - you might want to implement proper roles
    if include_users and hasattr(current_user, "is_admin") and current_user.is_admin:
        # This is a simplified search - in real app you'd implement more complex logic
        users = db.query(User).filter(
            (User.username.ilike(f"%{query}%")) | 
            (User.email.ilike(f"%{query}%"))
        ).limit(limit).all()
        results.users = users
    
    return results
