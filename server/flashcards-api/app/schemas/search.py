from pydantic import BaseModel
from typing import List, Optional
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
