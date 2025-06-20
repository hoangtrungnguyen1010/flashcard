from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from typing import Optional
from app.config import settings

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    sync_client: Optional[MongoClient] = None
    database = None

    @classmethod
    async def connect_to_mongo(cls):
        """Create database connection."""
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
            cls.sync_client = MongoClient(settings.MONGODB_URL)
            cls.database = cls.client[settings.MONGODB_DB_NAME]
            
            # Test the connection
            await cls.client.admin.command('ping')
            print("✅ Connected to MongoDB successfully!")
            
            # Create indexes for better performance
            await cls._create_indexes()
            
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise e

    @classmethod
    async def close_mongo_connection(cls):
        """Close database connection."""
        if cls.client:
            cls.client.close()
        if cls.sync_client:
            cls.sync_client.close()
        print("🔌 MongoDB connection closed.")

    @classmethod
    async def _create_indexes(cls):
        """Create database indexes for better performance."""
        try:
            # User indexes
            await cls.database.users.create_index("email", unique=True)
            await cls.database.users.create_index("username", unique=True)
            
            # Deck indexes
            await cls.database.decks.create_index("user_id")
            await cls.database.decks.create_index("is_public")
            
            # Flashcard indexes
            await cls.database.flashcards.create_index("deck_id")
            await cls.database.flashcards.create_index("user_id")
            await cls.database.flashcards.create_index([("question", "text"), ("answer", "text")])
            
            print("✅ Database indexes created successfully!")
            
        except Exception as e:
            print(f"⚠️ Warning: Failed to create indexes: {e}")

    @classmethod
    def get_collection(cls, collection_name: str):
        """Get a collection from the database."""
        if not cls.database:
            raise Exception("Database not connected. Call connect_to_mongo() first.")
        return cls.database[collection_name]

# Database collections
def get_users_collection():
    return MongoDB.get_collection("users")

def get_decks_collection():
    return MongoDB.get_collection("decks")

def get_flashcards_collection():
    return MongoDB.get_collection("flashcards") 