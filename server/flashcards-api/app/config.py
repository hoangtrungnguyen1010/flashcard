import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Flashcards API"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings - MongoDB for production, SQLite for development
    DATABASE_TYPE: str = os.getenv("DATABASE_TYPE", "mongodb")  # "mongodb" or "sqlite"
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # MongoDB specific settings
    MONGODB_URL: Optional[str] = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "flashcards")
    
    # SQLite fallback
    SQLITE_URL: str = os.getenv("SQLITE_URL", "sqlite:///./data/flashcards.db")
    
    # API Keys for search functionality
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    SERPAPI_KEY: Optional[str] = os.getenv("SERPAPI_KEY")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
