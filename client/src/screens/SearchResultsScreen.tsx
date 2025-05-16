import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Flashcard } from '../types/navigation';

type SearchResultsScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'SearchResults'>;
    route: RouteProp<RootStackParamList, 'SearchResults'>;
};

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ navigation, route }) => {
  const { query } = route.params; // Query passed from previous screen
  const [results, setResults] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  // Fetch search results when the component mounts
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://example.com/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Generate flashcards based on the search query
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      const response = await fetch('https://example.com/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const generatedData = await response.json();
      const newFlashcards: Flashcard[] = generatedData.flashcards || [];

      setResults((prevResults) => [...newFlashcards, ...prevResults]);

      Alert.alert('Success', `${newFlashcards.length} flashcards generated successfully!`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate flashcards.');
    } finally {
      setGenerating(false);
    }
  };

  // Navigate back to previous screen
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Render each flashcard
  const renderFlashcard = ({ item }: { item: Flashcard }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.question}</Text>
        <Text style={styles.cardSubtitle}>{item.answer}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results for "{query}"</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, generating && styles.disabledButton]}
        onPress={handleGenerateFlashcards}
        disabled={generating}
      >
        <Text style={styles.generateButtonText}>
          {generating ? 'Generating Flashcards...' : 'Generate Flashcards'}
        </Text>
      </TouchableOpacity>

      {/* Results */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Finding flashcards...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFlashcard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No flashcards found</Text>
              <Text style={styles.emptySubtext}>Try generating new flashcards</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  generateButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#757575',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F0F0F0',
    paddingHorizontal: 12,
  },
  actionButton: {
    padding: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#616161',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchResultsScreen;