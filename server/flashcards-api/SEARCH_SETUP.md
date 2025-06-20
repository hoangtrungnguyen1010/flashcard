# Search Functionality Setup

This application now includes Google search integration with OpenAPI-powered flashcard generation. To use this feature, you need to set up the following API keys:

## Required API Keys

### 1. OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/)
- Create an account or sign in
- Navigate to API Keys section
- Create a new API key
- Copy the key

### 2. SerpAPI Key (for Google Search)
- Go to [SerpAPI](https://serpapi.com/)
- Create an account or sign in
- Get your API key from the dashboard
- Copy the key

## Environment Setup

Create a `.env` file in the `server/flashcards-api/` directory with the following content:

```env
# Database
DATABASE_URL=sqlite:///./flashcards.db

# Security
SECRET_KEY=your-secret-key-here

# API Keys for Search Functionality
OPENAI_API_KEY=your-openai-api-key-here
SERPAPI_KEY=your-serpapi-key-here
```

## Installation

1. Install the new dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables as shown above

3. Run the server:
```bash
python -m uvicorn main:app --reload
```

## API Endpoints

### Generate Flashcards from Search
- **POST** `/api/v1/search/generate-flashcards`
- Body: `{"query": "your search query", "num_flashcards": 5}`

### Save Generated Flashcards
- **POST** `/api/v1/search/save-generated-flashcards`
- Body: `{"flashcards": [...], "deck_name": "My Deck", "query": "original query"}`

## Usage

1. Make a POST request to `/api/v1/search/generate-flashcards` with your search query
2. The system will search Google for relevant content
3. OpenAPI will generate educational flashcards based on the search results
4. You can then save the generated flashcards to a deck using the save endpoint

## Notes

- The search functionality requires both API keys to be properly configured
- Google search results are limited to the top 5 results for efficiency
- Content extraction is limited to 1000 characters per result to avoid token limits
- Generated flashcards are created using GPT-3.5-turbo model 