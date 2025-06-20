# FlashcardApp

A modern flashcard application with AI-powered content generation using Google search and OpenAPI integration.

## Features

- **AI-Powered Flashcard Generation**: Search the web and automatically generate educational flashcards
- **Google Search Integration**: Uses SerpAPI to search for relevant content
- **OpenAPI Integration**: Uses GPT-3.5-turbo to generate high-quality flashcards
- **Modern React Native Client**: Beautiful, responsive mobile interface
- **FastAPI Backend**: Robust, scalable API with authentication
- **SQLite Database**: Lightweight, file-based database for easy deployment

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
   DATABASE_URL=sqlite:///./flashcards.db
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

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Search & Flashcard Generation
- `POST /api/v1/search/generate-flashcards` - Generate flashcards from web search
- `POST /api/v1/search/save-generated-flashcards` - Save generated flashcards to deck
- `GET /api/v1/search` - Search existing flashcards

### Flashcards & Decks
- `GET /api/v1/flashcards` - Get user's flashcards
- `POST /api/v1/flashcards` - Create new flashcard
- `GET /api/v1/decks` - Get user's decks
- `POST /api/v1/decks` - Create new deck

## How It Works

### 1. Search Process
1. User enters a search query in the mobile app
2. App sends request to `/api/v1/search/generate-flashcards`
3. Server uses SerpAPI to search Google for relevant content
4. Server extracts content from top search results
5. Server uses OpenAI GPT-3.5-turbo to generate educational flashcards
6. Generated flashcards are returned to the client

### 2. Content Generation
- **Google Search**: Uses SerpAPI to get top 5 relevant search results
- **Content Extraction**: BeautifulSoup extracts text content from web pages
- **AI Generation**: OpenAI GPT-3.5-turbo creates educational flashcards
- **Quality Control**: Content is limited to avoid token limits and ensure quality

### 3. Flashcard Management
- Generated flashcards can be saved to custom decks
- Users can edit, delete, and organize their flashcards
- Search functionality works across existing flashcards

## Configuration

### API Keys Setup

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add to your `.env` file

#### SerpAPI Key
1. Go to [SerpAPI](https://serpapi.com/)
2. Create an account or sign in
3. Get your API key from the dashboard
4. Add to your `.env` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database URL | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for flashcard generation | Yes |
| `SERPAPI_KEY` | SerpAPI key for Google search | Yes |

## Development

### Backend Development
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (can be changed to PostgreSQL/MySQL)
- **Authentication**: JWT tokens
- **Testing**: pytest

### Frontend Development
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React hooks
- **Styling**: StyleSheet API

## Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Verify your API keys are correctly set in the `.env` file
   - Check that you have sufficient credits in your OpenAI and SerpAPI accounts

2. **Server Not Starting**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check that the port 8000 is not in use
   - Verify your Python version is 3.8+

3. **Client Not Connecting**
   - Ensure the server is running on `http://localhost:8000`
   - Check that the API_BASE_URL in `client/src/utils/api.ts` matches your server URL
   - For physical devices, use your computer's IP address instead of localhost

4. **Search Not Working**
   - Run the test script: `python test_search.py`
   - Check the server logs for detailed error messages
   - Verify your API keys have sufficient permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
1. Check the troubleshooting section above
2. Review the `SEARCH_SETUP.md` file for detailed setup instructions
3. Open an issue on GitHub 