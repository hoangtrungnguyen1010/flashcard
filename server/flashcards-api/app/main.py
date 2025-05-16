from fastapi import FastAPI
from app.api.routes import auth, users, flashcards, decks
from app.core.errors import register_exception_handlers
from app.config import settings

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

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
