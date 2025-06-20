from fastapi import FastAPI
from .app.api.routes import auth, users, flashcards, decks, search
from .app.core.errors import register_exception_handlers
from .app.config import settings
from .app.db.mongodb import MongoDB

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for managing flashcards and users",
    version="1.0.0"
)

# Register exception handlers
register_exception_handlers(app)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(flashcards.router)
app.include_router(decks.router)
app.include_router(search.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup."""
    if settings.DATABASE_TYPE.lower() == "mongodb":
        print("🚀 Starting with MongoDB database...")
        await MongoDB.connect_to_mongo()
    else:
        print("🚀 Starting with SQLite database...")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    if settings.DATABASE_TYPE.lower() == "mongodb":
        await MongoDB.close_mongo_connection()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        if settings.DATABASE_TYPE.lower() == "mongodb":
            # Test MongoDB connection
            await MongoDB.client.admin.command('ping')
            db_status = "connected"
        else:
            # SQLite is file-based, so just check if we can access it
            db_status = "ready"
        
        return {
            "status": "healthy",
            "database": settings.DATABASE_TYPE,
            "database_status": db_status,
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": settings.DATABASE_TYPE,
            "error": str(e),
            "version": "1.0.0"
        }

@app.get("/")
async def root():
    """Root endpoint with database information."""
    return {
        "message": "FlashcardApp API",
        "database": settings.DATABASE_TYPE,
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
