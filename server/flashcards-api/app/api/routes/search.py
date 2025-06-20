from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Any, Optional
from uuid import UUID

from app import schemas
from app.api import deps
from app.db.repositories import user_repository, flashcard_repository, deck_repository
from app.models.user import User
from app.config import settings
from app.services.search_service import SearchService

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

@router.post("/generate-flashcards", response_model=schemas.GeneratedFlashcardsResponse)
async def generate_flashcards_from_search(
    *,
    request: schemas.GenerateFlashcardsRequest,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Search Google for content and generate flashcards using OpenAPI.
    """
    if not settings.OPENAI_API_KEY or not settings.SERPAPI_KEY:
        raise HTTPException(
            status_code=500,
            detail="Search functionality is not configured. Please set OPENAI_API_KEY and SERPAPI_KEY environment variables."
        )
    
    try:
        search_service = SearchService()
        flashcards = await search_service.search_and_generate_flashcards(
            query=request.query,
            num_flashcards=request.num_flashcards
        )
        
        return schemas.GeneratedFlashcardsResponse(
            flashcards=flashcards,
            query=request.query,
            count=len(flashcards)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating flashcards: {str(e)}"
        )

@router.post("/save-generated-flashcards", response_model=schemas.SaveFlashcardsResponse)
async def save_generated_flashcards(
    *,
    request: schemas.SaveFlashcardsRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Save generated flashcards to a deck.
    """
    try:
        # Create or get the deck
        deck = deck_repository.get_by_name(db, name=request.deck_name, user_id=current_user.id)
        if not deck:
            deck_data = schemas.DeckCreate(
                name=request.deck_name,
                description=f"Generated flashcards for: {request.query}"
            )
            deck = deck_repository.create(db, obj_in=deck_data, user_id=current_user.id)
        
        # Create flashcards
        created_flashcards = []
        for flashcard_data in request.flashcards:
            flashcard_create = schemas.FlashcardCreate(
                question=flashcard_data["question"],
                answer=flashcard_data["answer"],
                deck_id=deck.id
            )
            flashcard = flashcard_repository.create(db, obj_in=flashcard_create, user_id=current_user.id)
            created_flashcards.append(flashcard)
        
        return schemas.SaveFlashcardsResponse(
            deck=deck,
            flashcards=created_flashcards,
            count=len(created_flashcards)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving flashcards: {str(e)}"
        )
