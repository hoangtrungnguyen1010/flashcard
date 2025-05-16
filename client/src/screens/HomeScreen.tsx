import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Interest, FlashcardList, Flashcard } from '../types/navigation';
import { sampleFlashcardLists, sampleInterests, getAllFlashcards } from '../utils/data';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [interests, setInterests] = useState<Interest[]>(sampleInterests);
  const [flashcardLists] = useState<FlashcardList[]>(sampleFlashcardLists);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Flashcard[]>([]);
  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);
  const [editingInterestText, setEditingInterestText] = useState<string>('');

    // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // When search query is not empty, navigate to SearchResultsScreen
    if (query.trim()) {
      navigation.navigate('SearchResults', { query });
    }
  };

  // Research interest management functions
  const startEditInterest = (interest: Interest) => {
    setEditingInterestId(interest.id);
    setEditingInterestText(interest.title);
  };

  const saveEditInterest = () => {
    if (!editingInterestId) return;
    
    setInterests(interests.map(interest => 
      interest.id === editingInterestId 
        ? { ...interest, title: editingInterestText } 
        : interest
    ));
    
    setEditingInterestId(null);
    setEditingInterestText('');
  };

  const deleteInterest = (id: string) => {
    Alert.alert(
      "Delete Interest",
      "Are you sure you want to delete this interest?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => setInterests(interests.filter(interest => interest.id !== id)),
          style: "destructive"
        }
      ]
    );
  };

  const addInterest = () => {
    const newInterest: Interest = {
      id: (interests.length + 1).toString(),
      title: 'New Interest'
    };
    setInterests([...interests, newInterest]);
    startEditInterest(newInterest);
  };

  // Navigate to flashcard list screen
  const viewFlashcardList = (list: FlashcardList) => {
    navigation.navigate('FlashcardList', { list });
  };
  
  // Navigate to flashcard screen from search results
  const viewFlashcard = (flashcard: Flashcard) => {
    navigation.navigate('Flashcard', { flashcard });
  };
  
  // Navigate to create new list screen
  const createNewList = () => {
    navigation.navigate('CreateList');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Flash Cards</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {/* Settings functionality */}}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search flashcards..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
        {isSearching && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      {isSearching ? (
        // Search Results
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.searchResultItem}
              underlayColor="#f0f0f0"
              onPress={() => viewFlashcard(item)}
            >
              <View>
                <Text style={styles.searchItemCategory}>{item.category}</Text>
                <Text style={styles.searchItemQuestion}>{item.question}</Text>
                <Text style={styles.searchItemAnswer} numberOfLines={1}>{item.answer}</Text>
              </View>
            </TouchableHighlight>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No results found</Text>
            </View>
          }
        />
      ) : (
        // Main Content
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
        >
          {/* Research Interests Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Research Interests</Text>
            <TouchableHighlight
              style={styles.addButton}
              underlayColor="#e0e0e0"
              onPress={addInterest}
            >
              <Ionicons name="add" size={24} color="#007bff" />
            </TouchableHighlight>
          </View>
          
          {interests.map((interest) => (
            <View key={interest.id} style={styles.interestItem}>
              {editingInterestId === interest.id ? (
                <View style={styles.interestEditContainer}>
                  <TextInput
                    style={styles.interestEditInput}
                    value={editingInterestText}
                    onChangeText={setEditingInterestText}
                    autoFocus
                  />
                  <TouchableOpacity 
                    style={styles.interestSaveButton}
                    onPress={saveEditInterest}
                  >
                    <Ionicons name="checkmark" size={24} color="green" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.interestViewContainer}>
                  <Text style={styles.interestText}>{interest.title}</Text>
                  <View style={styles.interestActions}>
                    <TouchableOpacity 
                      style={styles.interestActionButton}
                      onPress={() => startEditInterest(interest)}
                    >
                      <Ionicons name="create-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.interestActionButton}
                      onPress={() => deleteInterest(interest.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
          
          {/* Flashcard Lists Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flashcard Lists</Text>
            <TouchableHighlight
              style={styles.addButton}
              underlayColor="#e0e0e0"
              onPress={createNewList}
            >
              <Ionicons name="add" size={24} color="#007bff" />
            </TouchableHighlight>
          </View>
          
          {flashcardLists.map((list) => (
            <TouchableHighlight
              key={list.id}
              style={[styles.listCard, { borderLeftColor: list.color }]}
              underlayColor="#f0f0f0"
              onPress={() => viewFlashcardList(list)}
            >
              <View>
                <View style={styles.listCardHeader}>
                  <Text style={styles.listCardTitle}>{list.title}</Text>
                  <View style={[styles.listCardBadge, { backgroundColor: list.color }]}>
                    <Text style={styles.listCardBadgeText}>{list.cards.length}</Text>
                  </View>
                </View>
                <Text style={styles.listCardDescription}>{list.description}</Text>
              </View>
            </TouchableHighlight>
          ))}
          
          {/* Bottom padding for better scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  interestViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  interestEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  interestText: {
    fontSize: 16,
    color: '#333',
  },
  interestEditInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 4,
  },
  interestSaveButton: {
    padding: 8,
  },
  interestActions: {
    flexDirection: 'row',
  },
  interestActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  listCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listCardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  listCardBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listCardDescription: {
    fontSize: 14,
    color: '#666',
  },
  searchResultItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchItemCategory: {
    fontSize: 12,
    color: '#007bff',
    marginBottom: 4,
  },
  searchItemQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  searchItemAnswer: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreen;
