import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Platform
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Flashcard } from '../types/navigation';
import FlashCard from '../components/FlashCard';

type FlashcardListScreenProps = {
  route: RouteProp<RootStackParamList, 'FlashcardList'>;
  navigation: StackNavigationProp<RootStackParamList, 'FlashcardList'>;
};

const FlashcardListScreen: React.FC<FlashcardListScreenProps> = ({ route, navigation }) => {
  const { list } = route.params;
  const [cards, setCards] = useState<Flashcard[]>(list.cards);

  const viewFlashcard = (flashcard: Flashcard) => {
    navigation.navigate('Flashcard', { flashcard });
  };

  const addNewFlashcard = () => {
    navigation.navigate('CreateFlashcard', { listId: list.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{list.title}</Text>
          <Text style={styles.headerSubtitle}>{list.description}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: list.color + '20' }]}>
            <Text style={[styles.statNumber, { color: list.color }]}>{cards.length}</Text>
            <Text style={styles.statLabel}>Cards</Text>
          </View>
        </View>
        
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Flashcards</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: list.color }]} 
            onPress={addNewFlashcard}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => viewFlashcard(item)}
              activeOpacity={0.7}
            >
              <FlashCard 
                question={item.question} 
                answer={item.answer} 
                category={item.category}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>No flashcards yet</Text>
              <TouchableOpacity 
                style={[styles.emptyStateButton, { backgroundColor: list.color }]}
                onPress={addNewFlashcard}
              >
                <Text style={styles.emptyStateButtonText}>Create Your First Flashcard</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    marginLeft: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FlashcardListScreen;
