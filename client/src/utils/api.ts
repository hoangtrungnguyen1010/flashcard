// API Base URL - configurable for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export interface GeneratedFlashcard {
  question: string;
  answer: string;
}

export interface GenerateFlashcardsRequest {
  query: string;
  num_flashcards: number;
}

export interface GenerateFlashcardsResponse {
  flashcards: GeneratedFlashcard[];
  query: string;
  count: number;
}

export interface SaveFlashcardsRequest {
  flashcards: GeneratedFlashcard[];
  deck_name: string;
  query: string;
}

export interface SaveFlashcardsResponse {
  deck: any;
  flashcards: any[];
  count: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generate flashcards from search query
  async generateFlashcards(request: GenerateFlashcardsRequest): Promise<GenerateFlashcardsResponse> {
    return this.makeRequest<GenerateFlashcardsResponse>('/search/generate-flashcards', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Save generated flashcards to a deck
  async saveGeneratedFlashcards(request: SaveFlashcardsRequest): Promise<SaveFlashcardsResponse> {
    return this.makeRequest<SaveFlashcardsResponse>('/search/save-generated-flashcards', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Search existing flashcards
  async searchFlashcards(query: string): Promise<any> {
    return this.makeRequest(`/search?query=${encodeURIComponent(query)}&include_flashcards=true`);
  }
}

export const apiService = new ApiService(); 