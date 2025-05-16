export type RootStackParamList = {
  Home: undefined;
  Flashcard: { flashcard: Flashcard };
  FlashcardList: { list: FlashcardList };
  CreateFlashcard: { listId: string } | undefined;
  CreateList: undefined;
  SearchResults: { query: string }; // Pass the search query as a param

};

export interface Interest {
  id: string;
  title: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  listId: string;
}

export interface FlashcardList {
  id: string;
  title: string;
  description: string;
  color: string;
  cards: Flashcard[];
}
