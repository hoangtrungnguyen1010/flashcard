from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB connection details from environment variables
MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("MONGO_DATABASE", "flashcards")  # Default to "flashcards" if not provided

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
