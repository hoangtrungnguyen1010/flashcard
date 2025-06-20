#!/usr/bin/env python3
"""
Migration script to transfer data from SQLite to MongoDB
Usage: python migrate_to_mongodb.py
"""

import asyncio
import sqlite3
from datetime import datetime
from bson import ObjectId
from app.db.mongodb import MongoDB
from app.db.repositories.mongo_repositories import (
    mongo_user_repository,
    mongo_deck_repository,
    mongo_flashcard_repository
)

async def migrate_sqlite_to_mongodb():
    """Migrate data from SQLite to MongoDB."""
    print("🔄 Starting migration from SQLite to MongoDB...")
    
    # Connect to MongoDB
    await MongoDB.connect_to_mongo()
    
    # Connect to SQLite
    sqlite_conn = sqlite3.connect('./data/flashcards.db')
    sqlite_conn.row_factory = sqlite3.Row
    
    try:
        # Migrate users
        print("👥 Migrating users...")
        users_cursor = sqlite_conn.execute("SELECT * FROM users")
        user_id_mapping = {}  # Map SQLite user IDs to MongoDB ObjectIds
        
        for user_row in users_cursor.fetchall():
            user_data = dict(user_row)
            # Convert SQLite user ID to MongoDB ObjectId
            old_user_id = user_data.pop('id')
            
            # Create user in MongoDB
            mongo_user = await mongo_user_repository.create(user_data)
            user_id_mapping[old_user_id] = str(mongo_user.id)
            print(f"  ✅ Migrated user: {user_data['username']}")
        
        # Migrate decks
        print("📚 Migrating decks...")
        decks_cursor = sqlite_conn.execute("SELECT * FROM decks")
        deck_id_mapping = {}  # Map SQLite deck IDs to MongoDB ObjectIds
        
        for deck_row in decks_cursor.fetchall():
            deck_data = dict(deck_row)
            old_deck_id = deck_data.pop('id')
            old_user_id = deck_data.pop('user_id')
            
            # Map user ID
            if old_user_id in user_id_mapping:
                deck_data['user_id'] = ObjectId(user_id_mapping[old_user_id])
                
                # Create deck in MongoDB
                mongo_deck = await mongo_deck_repository.create(deck_data)
                deck_id_mapping[old_deck_id] = str(mongo_deck.id)
                print(f"  ✅ Migrated deck: {deck_data['name']}")
            else:
                print(f"  ⚠️ Skipped deck {deck_data['name']} - user not found")
        
        # Migrate flashcards
        print("🗂️ Migrating flashcards...")
        flashcards_cursor = sqlite_conn.execute("SELECT * FROM flashcards")
        
        for flashcard_row in flashcards_cursor.fetchall():
            flashcard_data = dict(flashcard_row)
            flashcard_data.pop('id')
            old_deck_id = flashcard_data.pop('deck_id')
            old_user_id = flashcard_data.pop('user_id')
            
            # Map IDs
            if (old_deck_id in deck_id_mapping and 
                old_user_id in user_id_mapping):
                flashcard_data['deck_id'] = ObjectId(deck_id_mapping[old_deck_id])
                flashcard_data['user_id'] = ObjectId(user_id_mapping[old_user_id])
                
                # Create flashcard in MongoDB
                await mongo_flashcard_repository.create(flashcard_data)
                print(f"  ✅ Migrated flashcard: {flashcard_data['question'][:50]}...")
            else:
                print(f"  ⚠️ Skipped flashcard - deck or user not found")
        
        print("🎉 Migration completed successfully!")
        print(f"📊 Migrated {len(user_id_mapping)} users, {len(deck_id_mapping)} decks, and flashcards")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise
    finally:
        sqlite_conn.close()
        await MongoDB.close_mongo_connection()

def backup_sqlite():
    """Create a backup of the SQLite database."""
    import shutil
    from datetime import datetime
    
    backup_name = f"flashcards_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
    backup_path = f"./data/{backup_name}"
    
    try:
        shutil.copy2('./data/flashcards.db', backup_path)
        print(f"💾 SQLite backup created: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"⚠️ Failed to create backup: {e}")
        return None

async def main():
    """Main migration function."""
    print("🚀 FlashcardApp SQLite to MongoDB Migration Tool")
    print("=" * 50)
    
    # Check if SQLite database exists
    import os
    if not os.path.exists('./data/flashcards.db'):
        print("❌ SQLite database not found at ./data/flashcards.db")
        print("Please ensure you have a SQLite database to migrate from.")
        return
    
    # Create backup
    backup_path = backup_sqlite()
    
    # Confirm migration
    response = input("\n⚠️ This will migrate all data from SQLite to MongoDB. Continue? (y/N): ")
    if response.lower() != 'y':
        print("Migration cancelled.")
        return
    
    # Run migration
    try:
        await migrate_sqlite_to_mongodb()
        print(f"\n✅ Migration completed! Your SQLite backup is at: {backup_path}")
        print("\n📝 Next steps:")
        print("1. Update your .env file to use MongoDB:")
        print("   DATABASE_TYPE=mongodb")
        print("   MONGODB_URL=mongodb://localhost:27017")
        print("   MONGODB_DB_NAME=flashcards")
        print("2. Restart your application")
        print("3. Test the application to ensure everything works")
        print("4. Once confirmed, you can remove the SQLite backup")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("Your original SQLite database is still intact.")

if __name__ == "__main__":
    asyncio.run(main()) 