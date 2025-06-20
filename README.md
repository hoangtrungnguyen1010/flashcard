# FlashcardApp

A modern flashcard application with AI-powered content generation using Google search and OpenAPI integration.

## Features

- **AI-Powered Flashcard Generation**: Search the web and automatically generate educational flashcards
- **Google Search Integration**: Uses SerpAPI to search for relevant content
- **OpenAPI Integration**: Uses GPT-3.5-turbo to generate high-quality flashcards

## Project Structure

```
FlashcardApp1/
├── server/
│   └── flashcards-api/          # FastAPI backend
│       ├── app/
│       │   ├── api/            # API routes
│       │   ├── core/           # Core functionality
│       │   ├── db/             # Database models and repositories
│       │   ├── models/         # SQLAlchemy models
│       │   ├── schemas/        # Pydantic schemas
│       │   └── services/       # Business logic (search service)
│       ├── requirements.txt    # Python dependencies
│       ├── main.py            # FastAPI application entry point
│       └── SEARCH_SETUP.md    # Search functionality setup guide
├── client/                     # React Native frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── navigation/        # Navigation configuration
│   │   ├── screens/           # Screen components
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions and API service
│   ├── package.json           # Node.js dependencies
│   └── App.tsx               # Main application component
└── README.md                 # This file
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- OpenAI API key
- SerpAPI key

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server/flashcards-api
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in `server/flashcards-api/` with:
   ```env
   MONGO_URL=your-url-here
   MONGO_DATABASE=your-mongo-name
   SECRET_KEY=your-secret-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   SERPAPI_KEY=your-serpapi-key-here
   ```

4. **Run the server:**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Test the search functionality:**
   ```bash
   python test_search.py
   ```

### Frontend Setup

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

