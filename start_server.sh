#!/bin/bash

# FlashcardApp Server Startup Script

echo "🚀 Starting FlashcardApp Server..."

# Check if we're in the right directory
if [ ! -f "server/flashcards-api/main.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to server directory
cd server/flashcards-api

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Please create a .env file with the following variables:"
    echo "DATABASE_URL=sqlite:///./flashcards.db"
    echo "SECRET_KEY=your-secret-key-here"
    echo "OPENAI_API_KEY=your-openai-api-key-here"
    echo "SERPAPI_KEY=your-serpapi-key-here"
    echo ""
    echo "See SEARCH_SETUP.md for detailed instructions"
    echo ""
fi

# Check if requirements are installed
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Start the server
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API documentation will be available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 