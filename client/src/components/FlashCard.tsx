import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FlashCardProps {
  question: string;
  answer: string;
  category?: string;
}

const FlashCard: React.FC<FlashCardProps> = ({ question, answer, category }) => {
  return (
    <View style={styles.container}>
      {category && <Text style={styles.category}>{category}</Text>}
      <Text style={styles.question} numberOfLines={2}>{question}</Text>
      <Text style={styles.answer} numberOfLines={3}>{answer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  answer: {
    fontSize: 16,
    color: '#666',
  },
});

export default FlashCard;
