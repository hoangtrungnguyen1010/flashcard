import os
import requests
import json
import re
from typing import List, Dict, Any
from bs4 import BeautifulSoup
import openai
from serpapi import GoogleSearch
from app.config import settings

class SearchService:
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not configured")
        if not settings.SERPAPI_KEY:
            raise ValueError("SERPAPI_KEY is not configured")
            
        self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        self.serpapi_key = settings.SERPAPI_KEY
    
    async def search_and_generate_flashcards(self, query: str, num_flashcards: int = 5) -> List[Dict[str, Any]]:
        """
        Search Google for content and generate flashcards using OpenAPI
        """
        try:
            # Step 1: Search Google using SerpAPI (synchronous call)
            search_results = self._google_search(query)
            
            # Step 2: Extract content from top results (synchronous call)
            content = self._extract_content_from_results(search_results)
            
            # Step 3: Generate flashcards using OpenAPI (synchronous call)
            flashcards = self._generate_flashcards_from_content(content, query, num_flashcards)
            
            return flashcards
            
        except Exception as e:
            print(f"Error in search_and_generate_flashcards: {e}")
            return []
    
    def _google_search(self, query: str) -> List[Dict[str, Any]]:
        """
        Perform Google search using SerpAPI (synchronous)
        """
        try:
            search = GoogleSearch({
                "q": query,
                "api_key": self.serpapi_key,
                "num": 5  # Get top 5 results
            })
            results = search.get_dict()
            
            # Extract organic results
            organic_results = results.get("organic_results", [])
            return organic_results[:5]  # Return top 5 results
            
        except Exception as e:
            print(f"Error in Google search: {e}")
            return []
    
    def _extract_content_from_results(self, search_results: List[Dict[str, Any]]) -> str:
        """
        Extract content from search result URLs (synchronous)
        """
        content_pieces = []
        
        for result in search_results:
            try:
                url = result.get("link")
                if url:
                    response = requests.get(url, timeout=10, headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    })
                    response.raise_for_status()  # Raise exception for bad status codes
                    
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Extract text content
                    text_content = soup.get_text()
                    # Clean up the text
                    cleaned_text = ' '.join(text_content.split())[:1000]  # Limit to 1000 chars
                    content_pieces.append(cleaned_text)
                    
            except Exception as e:
                print(f"Error extracting content from {result.get('link', 'unknown')}: {e}")
                continue
        
        return " ".join(content_pieces)
    
    def _generate_flashcards_from_content(self, content: str, original_query: str, num_flashcards: int) -> List[Dict[str, Any]]:
        """
        Generate flashcards using OpenAPI based on the content (synchronous)
        """
        try:
            if not content.strip():
                print("No content available for flashcard generation")
                return []
                
            prompt = f"""
            Based on the following content and search query, generate {num_flashcards} educational flashcards.
            
            Search Query: {original_query}
            Content: {content[:2000]}  # Limit content to avoid token limits
            
            Generate flashcards in the following format:
            - Each flashcard should have a clear question and answer
            - Questions should be educational and relevant to the search query
            - Answers should be concise but informative
            - Cover different aspects of the topic
            
            Return the flashcards as a JSON array with 'question' and 'answer' fields.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an educational assistant that creates high-quality flashcards."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            # Parse the response to extract flashcards
            response_text = response.choices[0].message.content
            
            # Try to extract JSON from the response
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                try:
                    flashcards_data = json.loads(json_match.group())
                    # Validate the structure
                    if isinstance(flashcards_data, list):
                        validated_flashcards = []
                        for card in flashcards_data:
                            if isinstance(card, dict) and 'question' in card and 'answer' in card:
                                validated_flashcards.append({
                                    "question": str(card['question']),
                                    "answer": str(card['answer'])
                                })
                        return validated_flashcards[:num_flashcards]
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    print(f"Error parsing JSON response: {e}")
            
            # Fallback: parse manually if JSON parsing fails
            flashcards = []
            lines = response_text.split('\n')
            current_question = None
            
            for line in lines:
                line = line.strip()
                if line.startswith('Q:') or line.startswith('Question:'):
                    current_question = line.split(':', 1)[1].strip()
                elif (line.startswith('A:') or line.startswith('Answer:')) and current_question:
                    answer = line.split(':', 1)[1].strip()
                    flashcards.append({
                        "question": current_question,
                        "answer": answer
                    })
                    current_question = None
            
            return flashcards[:num_flashcards]
            
        except Exception as e:
            print(f"Error generating flashcards: {e}")
            return [] 