from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import get_users_collection, get_decks_collection, get_flashcards_collection
from app.models.mongo_models import UserMongo, DeckMongo, FlashcardMongo, PyObjectId

class MongoUserRepository:
    def __init__(self):
        self.collection = get_users_collection()

    async def create(self, user_data: Dict[str, Any]) -> UserMongo:
        """Create a new user."""
        user_data["created_at"] = datetime.utcnow()
        user_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        return UserMongo(**user_data)

    async def get_by_id(self, user_id: str) -> Optional[UserMongo]:
        """Get user by ID."""
        try:
            user_data = await self.collection.find_one({"_id": ObjectId(user_id)})
            return UserMongo(**user_data) if user_data else None
        except:
            return None

    async def get_by_email(self, email: str) -> Optional[UserMongo]:
        """Get user by email."""
        user_data = await self.collection.find_one({"email": email})
        return UserMongo(**user_data) if user_data else None

    async def get_by_username(self, username: str) -> Optional[UserMongo]:
        """Get user by username."""
        user_data = await self.collection.find_one({"username": username})
        return UserMongo(**user_data) if user_data else None

    async def update(self, user_id: str, update_data: Dict[str, Any]) -> Optional[UserMongo]:
        """Update user."""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count:
            return await self.get_by_id(user_id)
        return None

class MongoDeckRepository:
    def __init__(self):
        self.collection = get_decks_collection()

    async def create(self, deck_data: Dict[str, Any]) -> DeckMongo:
        """Create a new deck."""
        deck_data["created_at"] = datetime.utcnow()
        deck_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(deck_data)
        deck_data["_id"] = result.inserted_id
        return DeckMongo(**deck_data)

    async def get_by_id(self, deck_id: str) -> Optional[DeckMongo]:
        """Get deck by ID."""
        try:
            deck_data = await self.collection.find_one({"_id": ObjectId(deck_id)})
            return DeckMongo(**deck_data) if deck_data else None
        except:
            return None

    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[DeckMongo]:
        """Get decks by user ID."""
        cursor = self.collection.find({"user_id": ObjectId(user_id)}).skip(skip).limit(limit)
        decks = []
        async for deck_data in cursor:
            decks.append(DeckMongo(**deck_data))
        return decks

    async def get_by_name(self, name: str, user_id: str) -> Optional[DeckMongo]:
        """Get deck by name and user ID."""
        deck_data = await self.collection.find_one({
            "name": name,
            "user_id": ObjectId(user_id)
        })
        return DeckMongo(**deck_data) if deck_data else None

    async def get_public_decks(self, skip: int = 0, limit: int = 100) -> List[DeckMongo]:
        """Get public decks."""
        cursor = self.collection.find({"is_public": True}).skip(skip).limit(limit)
        decks = []
        async for deck_data in cursor:
            decks.append(DeckMongo(**deck_data))
        return decks

    async def search(self, query: str, user_id: Optional[str] = None, limit: int = 10) -> List[DeckMongo]:
        """Search decks."""
        search_filter = {}
        
        if user_id:
            search_filter["$or"] = [
                {"user_id": ObjectId(user_id)},
                {"is_public": True}
            ]
        else:
            search_filter["is_public"] = True
        
        # Text search
        search_filter["$text"] = {"$search": query}
        
        cursor = self.collection.find(search_filter).limit(limit)
        decks = []
        async for deck_data in cursor:
            decks.append(DeckMongo(**deck_data))
        return decks

    async def update(self, deck_id: str, update_data: Dict[str, Any]) -> Optional[DeckMongo]:
        """Update deck."""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(deck_id)},
            {"$set": update_data}
        )
        
        if result.modified_count:
            return await self.get_by_id(deck_id)
        return None

    async def delete(self, deck_id: str) -> bool:
        """Delete deck."""
        result = await self.collection.delete_one({"_id": ObjectId(deck_id)})
        return result.deleted_count > 0

class MongoFlashcardRepository:
    def __init__(self):
        self.collection = get_flashcards_collection()

    async def create(self, flashcard_data: Dict[str, Any]) -> FlashcardMongo:
        """Create a new flashcard."""
        flashcard_data["created_at"] = datetime.utcnow()
        flashcard_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(flashcard_data)
        flashcard_data["_id"] = result.inserted_id
        return FlashcardMongo(**flashcard_data)

    async def get_by_id(self, flashcard_id: str) -> Optional[FlashcardMongo]:
        """Get flashcard by ID."""
        try:
            flashcard_data = await self.collection.find_one({"_id": ObjectId(flashcard_id)})
            return FlashcardMongo(**flashcard_data) if flashcard_data else None
        except:
            return None

    async def get_by_deck(self, deck_id: str, skip: int = 0, limit: int = 100) -> List[FlashcardMongo]:
        """Get flashcards by deck ID."""
        cursor = self.collection.find({"deck_id": ObjectId(deck_id)}).skip(skip).limit(limit)
        flashcards = []
        async for flashcard_data in cursor:
            flashcards.append(FlashcardMongo(**flashcard_data))
        return flashcards

    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[FlashcardMongo]:
        """Get flashcards by user ID."""
        cursor = self.collection.find({"user_id": ObjectId(user_id)}).skip(skip).limit(limit)
        flashcards = []
        async for flashcard_data in cursor:
            flashcards.append(FlashcardMongo(**flashcard_data))
        return flashcards

    async def search(self, query: str, user_id: Optional[str] = None, limit: int = 10) -> List[FlashcardMongo]:
        """Search flashcards."""
        search_filter = {}
        
        if user_id:
            search_filter["user_id"] = ObjectId(user_id)
        
        # Text search
        search_filter["$text"] = {"$search": query}
        
        cursor = self.collection.find(search_filter).limit(limit)
        flashcards = []
        async for flashcard_data in cursor:
            flashcards.append(FlashcardMongo(**flashcard_data))
        return flashcards

    async def update(self, flashcard_id: str, update_data: Dict[str, Any]) -> Optional[FlashcardMongo]:
        """Update flashcard."""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(flashcard_id)},
            {"$set": update_data}
        )
        
        if result.modified_count:
            return await self.get_by_id(flashcard_id)
        return None

    async def delete(self, flashcard_id: str) -> bool:
        """Delete flashcard."""
        result = await self.collection.delete_one({"_id": ObjectId(flashcard_id)})
        return result.deleted_count > 0

# Repository instances
mongo_user_repository = MongoUserRepository()
mongo_deck_repository = MongoDeckRepository()
mongo_flashcard_repository = MongoFlashcardRepository() 