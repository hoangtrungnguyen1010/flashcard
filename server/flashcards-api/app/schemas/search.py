from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .user import User
from .deck import Deck
from .flashcard import Flashcard

class SearchResults(BaseModel):
    users: List[User] = []
    decks: List[Deck] = []
    flashcards: List[Flashcard] = []
    
class SearchQuery(BaseModel):
    query: str
    include_users: bool = True
    include_decks: bool = True
    include_flashcards: bool = True
    limit: Optional[int] = 10

class GenerateFlashcardsRequest(BaseModel):
    query: str
    num_flashcards: int = 5

class GeneratedFlashcard(BaseModel):
    question: str
    answer: str

class GeneratedFlashcardsResponse(BaseModel):
    flashcards: List[Dict[str, str]]
    query: str
    count: int

class SaveFlashcardsRequest(BaseModel):
    flashcards: List[Dict[str, str]]
    deck_name: str
    query: str

class SaveFlashcardsResponse(BaseModel):
    deck: Deck
    flashcards: List[Flashcard]
    count: int
