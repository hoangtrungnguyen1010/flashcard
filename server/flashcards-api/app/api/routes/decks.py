from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List
from uuid import UUID

from app import schemas
from app.api import deps
from app.db.repositories import deck_repository
from app.models.user import User
from app.config import settings

router = APIRouter(prefix=f"{settings.API_V1_STR}/decks", tags=["decks"])

@router.post("", response_model=schemas.Deck)
def create_deck(
    *,
    db: Session = Depends(deps.get_db),
    deck_in: schemas.DeckCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new deck.
    """
    return deck_repository.create(
        db, obj_in=deck_in, user_id=current_user.id
    )

@router.get("", response_model=List[schemas.Deck])
def read_decks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    public_only: bool = False,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve decks.
    """
    if public_only:
        return deck_repository.get_public_decks(db, skip=skip, limit=limit)
    
    return deck_repository.get_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )

@router.get("/{id}", response_model=schemas.DeckWithFlashcards)
def read_deck(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get deck by ID with its flashcards.
    """
    deck = deck_repository.get(db, id=id)
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck not found",
        )
    
    if deck.user_id != current_user.id and not deck.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return deck

@router.put("/{id}", response_model=schemas.Deck)
def update_deck(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    deck_in: schemas.DeckUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a deck.
    """
    deck = deck_repository.get(db, id=id)
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck not found",
        )
    
    if deck.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return deck_repository.update(db, db_obj=deck, obj_in=deck_in)

@router.delete("/{id}", response_model=schemas.Deck)
def delete_deck(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a deck and all its flashcards.
    """
    deck = deck_repository.get(db, id=id)
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck not found",
        )
    
    if deck.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return deck_repository.remove(db, id=id)
