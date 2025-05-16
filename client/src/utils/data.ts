import { Interest, Flashcard, FlashcardList } from '../types/navigation';

export const sampleInterests: Interest[] = [
  { id: '1', title: 'Machine Learning' },
  { id: '2', title: 'React Native Development' },
  { id: '3', title: 'Blockchain Technology' },
];

export const sampleFlashcardLists: FlashcardList[] = [
  {
    id: '1',
    title: 'React Native Basics',
    description: 'Fundamental concepts of React Native',
    color: '#FF9500',
    cards: [
      {
        id: '101',
        question: 'What is React Native?',
        answer: 'React Native is a JavaScript framework for building native mobile apps for iOS and Android.',
        category: 'Development',
        listId: '1'
      },
      {
        id: '102',
        question: 'What is useState in React?',
        answer: 'useState is a Hook that lets you add React state to function components.',
        category: 'Development',
        listId: '1'
      },
      {
        id: '103',
        question: 'What is the difference between React and React Native?',
        answer: 'React is for building web interfaces, while React Native is for building native mobile apps using React principles.',
        category: 'Development',
        listId: '1'
      }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Concepts',
    description: 'Key concepts in machine learning',
    color: '#5856D6',
    cards: [
      {
        id: '201',
        question: 'What is a Neural Network?',
        answer: 'A neural network is a series of algorithms that endeavors to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.',
        category: 'Machine Learning',
        listId: '2'
      },
      {
        id: '202',
        question: 'What is Supervised Learning?',
        answer: 'Supervised learning is a type of machine learning where the algorithm learns from labeled training data, helping to predict outcomes for unforeseen data.',
        category: 'Machine Learning',
        listId: '2'
      }
    ]
  },
  {
    id: '3',
    title: 'Blockchain Fundamentals',
    description: 'Basic concepts of blockchain technology',
    color: '#007AFF',
    cards: [
      {
        id: '301',
        question: 'What is Blockchain?',
        answer: 'A blockchain is a distributed database or ledger shared among computer network nodes that stores information electronically in digital format.',
        category: 'Blockchain',
        listId: '3'
      },
      {
        id: '302',
        question: 'What is a Smart Contract?',
        answer: 'A smart contract is a self-executing contract with the terms directly written into code, automatically enforcing obligations when predetermined conditions are met.',
        category: 'Blockchain',
        listId: '3'
      }
    ]
  },
];

// Flatten all cards for search functionality
export const getAllFlashcards = (): Flashcard[] => {
  return sampleFlashcardLists.flatMap(list => list.cards);
};
