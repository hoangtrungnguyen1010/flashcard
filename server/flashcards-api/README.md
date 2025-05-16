
### README.md
```markdown
# Flashcards API

A RESTful API for creating and managing flashcards built with FastAPI.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete flashcards
- Organize flashcards into decks
- Search functionality across flashcards, decks, and users

## Installation and Setup

### Prerequisites

- Python 3.8+
- pip
- virtualenv (optional)

### Setup Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/flashcards-api.git
   cd flashcards-api
   ```

2. Create and activate a virtual environment (optional):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy the example environment file and modify as needed:
   ```
   cp .env.example .env
   ```

5. Run the application:
   ```
   uvicorn app.main:app --reload
   ```

6. Access the API documentation at:
   ```
   http://localhost:8000/docs
   ```

## API Endpoints

### Authentication
- POST `/api/v1/auth/login` - Get access token

### Users
- POST `/api/v1/users` - Register a new user
- GET `/api/v1/users/me` - Get current user info

### Decks
- POST `/api/v1/decks` - Create a new deck
- GET `/api/v1/decks` - List user's decks
- GET `/api/v1/decks/{id}` - Get specific deck
- PUT `/api/v1/decks/{id}` - Update a deck
- DELETE `/api/v1/decks/{id}` - Delete a deck

### Flashcards
- POST `/api/v1/flashcards` - Create a new flashcard
- GET `/api/v1/flashcards` - List user's flashcards
- GET `/api/v1/flashcards/{id}` - Get specific flashcard
- PUT `/api/v1/flashcards/{id}` - Update a flashcard
- DELETE `/api/v1/flashcards/{id}` - Delete a flashcard

### Search
- GET `/api/v1/search` - Search across flashcards, decks, and users

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```

### Dockerfile
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml
```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/flashcards
      - SECRET_KEY=your_production_secret_key
    depends_on:
      - db

  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=flashcards
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```


PYTHONPATH=$(pwd) python app/main.py
