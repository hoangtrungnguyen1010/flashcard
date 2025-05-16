import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashcardList } from '../types/navigation';

interface FlashcardListItemProps {
  list: FlashcardList;
  onPress: (list: FlashcardList) => void;
}

const FlashcardListItem: React.FC<FlashcardListItemProps> = ({ list, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: list.color + '15' }]}
      onPress={() => onPress(list)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{list.title}</Text>
          <View style={[styles.badge, { backgroundColor: list.color }]}>
            <Text style={styles.badgeText}>{list.cards.length}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{list.description}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    cursor: Platform.OS === 'web' ? 'pointer' : 'default',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default FlashcardListItem;
