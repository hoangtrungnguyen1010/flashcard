#!/usr/bin/env python3
"""
Test script for the search functionality
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.search_service import SearchService

async def test_search_service():
    """Test the search service functionality"""
    
    # Check if API keys are set
    openai_key = os.getenv("OPENAI_API_KEY")
    serpapi_key = os.getenv("SERPAPI_KEY")
    
    if not openai_key or not serpapi_key:
        print("❌ API keys not found. Please set OPENAI_API_KEY and SERPAPI_KEY environment variables.")
        print("See SEARCH_SETUP.md for instructions.")
        return
    
    print("✅ API keys found")
    
    # Create search service
    search_service = SearchService()
    
    # Test search
    test_query = "machine learning basics"
    print(f"\n🔍 Testing search for: '{test_query}'")
    
    try:
        flashcards = await search_service.search_and_generate_flashcards(
            query=test_query,
            num_flashcards=3
        )
        
        if flashcards:
            print(f"✅ Successfully generated {len(flashcards)} flashcards:")
            for i, flashcard in enumerate(flashcards, 1):
                print(f"\n{i}. Question: {flashcard.get('question', 'N/A')}")
                print(f"   Answer: {flashcard.get('answer', 'N/A')}")
        else:
            print("❌ No flashcards generated")
            
    except Exception as e:
        print(f"❌ Error during search: {e}")

if __name__ == "__main__":
    asyncio.run(test_search_service()) 