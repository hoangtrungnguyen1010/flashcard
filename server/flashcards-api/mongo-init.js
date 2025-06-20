// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('🚀 Initializing FlashcardApp MongoDB database...');

// Switch to the flashcards database
db = db.getSiblingDB('flashcards');

// Create collections if they don't exist
db.createCollection('users');
db.createCollection('decks');
db.createCollection('flashcards');

// Create indexes for better performance
print('📊 Creating database indexes...');

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "created_at": -1 });

// Deck indexes
db.decks.createIndex({ "user_id": 1 });
db.decks.createIndex({ "is_public": 1 });
db.decks.createIndex({ "name": 1 });
db.decks.createIndex({ "created_at": -1 });

// Flashcard indexes
db.flashcards.createIndex({ "deck_id": 1 });
db.flashcards.createIndex({ "user_id": 1 });
db.flashcards.createIndex({ "created_at": -1 });

// Text search indexes
db.decks.createIndex({ 
    "name": "text", 
    "description": "text" 
}, {
    weights: {
        name: 10,
        description: 5
    }
});

db.flashcards.createIndex({ 
    "question": "text", 
    "answer": "text" 
}, {
    weights: {
        question: 10,
        answer: 5
    }
});

print('✅ Database indexes created successfully!');

// Create a sample admin user if no users exist
const userCount = db.users.countDocuments();
if (userCount === 0) {
    print('👤 Creating sample admin user...');
    
    // Note: In production, this should be removed and users should register normally
    const sampleUser = {
        username: "admin",
        email: "admin@flashcards.com",
        hashed_password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8eO", // "password123"
        is_active: true,
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    db.users.insertOne(sampleUser);
    print('✅ Sample admin user created (username: admin, password: password123)');
}

print('🎉 MongoDB initialization completed!');
print('📝 Database: flashcards');
print('📊 Collections: users, decks, flashcards');
print('🔍 Text search enabled for decks and flashcards'); 