#!/usr/bin/env python3
"""
Test script to verify MongoDB connectivity and functionality
Usage: python test_mongodb.py
"""

import asyncio
import os
from app.db.mongodb import MongoDB
from app.db.repositories.mongo_repositories import (
    mongo_user_repository,
    mongo_deck_repository,
    mongo_flashcard_repository
)

async def test_mongodb_connection():
    """Test MongoDB connection and basic operations."""
    print("🧪 Testing MongoDB Connection and Functionality")
    print("=" * 50)
    
    try:
        # Test connection
        print("1. Testing connection...")
        await MongoDB.connect_to_mongo()
        print("   ✅ MongoDB connection successful!")
        
        # Test user operations
        print("\n2. Testing user operations...")
        test_user = {
            "username": "testuser",
            "email": "test@example.com",
            "hashed_password": "test_hash",
            "is_active": True,
            "is_admin": False
        }
        
        created_user = await mongo_user_repository.create(test_user)
        print(f"   ✅ User created: {created_user.username}")
        
        retrieved_user = await mongo_user_repository.get_by_id(str(created_user.id))
        print(f"   ✅ User retrieved: {retrieved_user.username}")
        
        # Test deck operations
        print("\n3. Testing deck operations...")
        test_deck = {
            "name": "Test Deck",
            "description": "A test deck for MongoDB",
            "user_id": created_user.id,
            "is_public": False
        }
        
        created_deck = await mongo_deck_repository.create(test_deck)
        print(f"   ✅ Deck created: {created_deck.name}")
        
        # Test flashcard operations
        print("\n4. Testing flashcard operations...")
        test_flashcard = {
            "question": "What is MongoDB?",
            "answer": "A NoSQL document database",
            "deck_id": created_deck.id,
            "user_id": created_user.id
        }
        
        created_flashcard = await mongo_flashcard_repository.create(test_flashcard)
        print(f"   ✅ Flashcard created: {created_flashcard.question}")
        
        # Test search functionality
        print("\n5. Testing search functionality...")
        search_results = await mongo_flashcard_repository.search("MongoDB")
        print(f"   ✅ Search found {len(search_results)} results")
        
        # Test user's decks
        print("\n6. Testing user's decks...")
        user_decks = await mongo_deck_repository.get_by_user(str(created_user.id))
        print(f"   ✅ User has {len(user_decks)} decks")
        
        # Test deck's flashcards
        print("\n7. Testing deck's flashcards...")
        deck_flashcards = await mongo_flashcard_repository.get_by_deck(str(created_deck.id))
        print(f"   ✅ Deck has {len(deck_flashcards)} flashcards")
        
        # Cleanup test data
        print("\n8. Cleaning up test data...")
        await mongo_flashcard_repository.delete(str(created_flashcard.id))
        await mongo_deck_repository.delete(str(created_deck.id))
        await mongo_user_repository.update(str(created_user.id), {"is_active": False})
        print("   ✅ Test data cleaned up")
        
        print("\n🎉 All MongoDB tests passed!")
        print("✅ MongoDB is ready for production use!")
        
    except Exception as e:
        print(f"\n❌ MongoDB test failed: {e}")
        print("Please check your MongoDB configuration and connection.")
        raise
    finally:
        await MongoDB.close_mongo_connection()

def check_environment():
    """Check if environment variables are set correctly."""
    print("🔍 Checking environment configuration...")
    
    database_type = os.getenv("DATABASE_TYPE", "mongodb")
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    mongodb_db = os.getenv("MONGODB_DB_NAME", "flashcards")
    
    print(f"   Database Type: {database_type}")
    print(f"   MongoDB URL: {mongodb_url}")
    print(f"   MongoDB Database: {mongodb_db}")
    
    if database_type.lower() != "mongodb":
        print("   ⚠️ Warning: DATABASE_TYPE is not set to 'mongodb'")
        print("   Set DATABASE_TYPE=mongodb to use MongoDB")
    
    return database_type.lower() == "mongodb"

async def main():
    """Main test function."""
    print("🚀 MongoDB Test Suite for FlashcardApp")
    print("=" * 50)
    
    # Check environment
    if not check_environment():
        print("\n❌ Environment not configured for MongoDB")
        print("Please set DATABASE_TYPE=mongodb in your .env file")
        return
    
    # Run tests
    try:
        await test_mongodb_connection()
    except Exception as e:
        print(f"\n❌ Test suite failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Ensure MongoDB is running: docker-compose up -d mongodb")
        print("2. Check MongoDB logs: docker logs flashcards-mongodb")
        print("3. Verify connection string in .env file")
        print("4. Ensure MongoDB dependencies are installed: pip install motor pymongo")

if __name__ == "__main__":
    asyncio.run(main()) 