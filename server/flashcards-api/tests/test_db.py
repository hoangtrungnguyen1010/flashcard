import asyncio
from app.db.database import db

async def test_connection():
    try:
        # Test connection by listing collection names
        collections = await db.list_collection_names()
        print("Connected to MongoDB! Collections:", collections)
    except Exception as e:
        print("Error connecting to MongoDB:", e)

asyncio.run(test_connection())
