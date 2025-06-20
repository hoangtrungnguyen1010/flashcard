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
    TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Flashcard } from '../types/navigation';
import { apiService, GeneratedFlashcard } from '../utils/api';

type SearchResultsScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'SearchResults'>;
    route: RouteProp<RootStackParamList, 'SearchResults'>;
};

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ navigation, route }) => {
  const { query } = route.params; // Query passed from previous screen
  const [results, setResults] = useState<GeneratedFlashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [deckName, setDeckName] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);

  // Generate flashcards based on the search query
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      const response = await apiService.generateFlashcards({
        query: query,
        num_flashcards: 5
      });

      setResults(response.flashcards);
      setDeckName(`Generated: ${query}`);
      setShowSaveDialog(true);

      Alert.alert('Success', `${response.count} flashcards generated successfully!`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate flashcards. Please check your API configuration.');
    } finally {
      setGenerating(false);
    }
  };

  // Save generated flashcards to a deck
  const handleSaveFlashcards = async () => {
    if (!deckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.saveGeneratedFlashcards({
        flashcards: results,
        deck_name: deckName,
        query: query
      });

      Alert.alert('Success', `Flashcards saved to deck "${response.deck.name}"!`);
      setShowSaveDialog(false);
      setResults([]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save flashcards.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to previous screen
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Render each flashcard
  const renderFlashcard = ({ item }: { item: GeneratedFlashcard }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.question}</Text>
        <Text style={styles.cardSubtitle}>{item.answer}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search: "{query}"</Text>
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
          {generating ? 'Generating Flashcards...' : 'Generate Flashcards from Web'}
        </Text>
      </TouchableOpacity>

      {/* Save Dialog */}
      {showSaveDialog && (
        <View style={styles.saveDialog}>
          <Text style={styles.saveDialogTitle}>Save Flashcards</Text>
          <TextInput
            style={styles.deckNameInput}
            placeholder="Enter deck name"
            value={deckName}
            onChangeText={setDeckName}
          />
          <View style={styles.saveDialogButtons}>
            <TouchableOpacity
              style={[styles.saveButton, styles.cancelButton]}
              onPress={() => setShowSaveDialog(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, styles.confirmButton]}
              onPress={handleSaveFlashcards}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFlashcard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No flashcards generated yet</Text>
          <Text style={styles.emptySubtext}>Tap "Generate Flashcards" to create flashcards from web search</Text>
        </View>
      )}
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
  saveDialog: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveDialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  deckNameInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  saveDialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#616161',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchResultsScreen;