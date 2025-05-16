from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List
from uuid import UUID

from app import schemas
from app.api import deps
from app.db.repositories import flashcard_repository, deck_repository
from app.models.user import User
from app.config import settings

router = APIRouter(prefix=f"{settings.API_V1_STR}/flashcards", tags=["flashcards"])

@router.post("", response_model=schemas.Flashcard)
def create_flashcard(
    *,
    db: Session = Depends(deps.get_db),
    flashcard_in: schemas.FlashcardCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new flashcard.
    """
    # Check if deck exists and belongs to the user
    deck = deck_repository.get(db, id=flashcard_in.deck_id)
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
    
    return flashcard_repository.create(
        db, obj_in=flashcard_in, user_id=current_user.id
    )

@router.get("", response_model=List[schemas.Flashcard])
def read_flashcards(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    deck_id: UUID = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve flashcards.
    """
    if deck_id:
        # Check if deck belongs to the user
        deck = deck_repository.get(db, id=deck_id)
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
        
        return flashcard_repository.get_by_deck(
            db, deck_id=deck_id, skip=skip, limit=limit
        )
    
    return flashcard_repository.get_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )

@router.get("/{id}", response_model=schemas.Flashcard)
def read_flashcard(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get flashcard by ID.
    """
    flashcard = flashcard_repository.get(db, id=id)
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )
    
    # Check if flashcard belongs to user or is in a public deck
    if flashcard.user_id != current_user.id and not flashcard.deck.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return flashcard

@router.put("/{id}", response_model=schemas.Flashcard)
def update_flashcard(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    flashcard_in: schemas.FlashcardUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a flashcard.
    """
    flashcard = flashcard_repository.get(db, id=id)
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )
    
    if flashcard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # If deck_id is being updated, check if new deck belongs to user
    if flashcard_in.deck_id and flashcard_in.deck_id != flashcard.deck_id:
        deck = deck_repository.get(db, id=flashcard_in.deck_id)
        if not deck:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Deck not found",
            )
        if deck.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions for this deck",
            )
    
    return flashcard_repository.update(db, db_obj=flashcard, obj_in=flashcard_in)

@router.delete("/{id}", response_model=schemas.Flashcard)
def delete_flashcard(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a flashcard.
    """
    flashcard = flashcard_repository.get(db, id=id)
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )
    
    if flashcard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return flashcard_repository.remove(db, id=id)
