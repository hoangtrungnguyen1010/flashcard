import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { sampleFlashcardLists } from '../utils/data';

type CreateFlashcardScreenProps = {
  route: RouteProp<RootStackParamList, 'CreateFlashcard'>;
  navigation: StackNavigationProp<RootStackParamList, 'CreateFlashcard'>;
};

const CreateFlashcardScreen: React.FC<CreateFlashcardScreenProps> = ({ route, navigation }) => {
  const listId = route.params?.listId;
  const list = sampleFlashcardLists.find(l => l.id === listId);
  
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [category, setCategory] = useState<string>(list?.title || '');

  const handleSave = () => {
    if (!question.trim()) {
      Alert.alert('Missing Information', 'Please enter a question');
      return;
    }

    if (!answer.trim()) {
      Alert.alert('Missing Information', 'Please enter an answer');
      return;
    }

    // In a real app, you would save this to your data store
    // For now, we'll just navigate back
    Alert.alert(
      'Flashcard Created',
      'Your flashcard has been created successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Flashcard</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={!question.trim() || !answer.trim()}
        >
          <Text 
            style={[
              styles.saveButtonText, 
              (!question.trim() || !answer.trim()) ? styles.disabledText : {}
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={styles.textInput}
            value={question}
            onChangeText={setQuestion}
            placeholder="Enter your question"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Answer</Text>
          <TextInput
            style={styles.textInput}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Enter the answer"
            multiline
            textAlignVertical="top"
            numberOfLines={6}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.textInput}
            value={category}
            onChangeText={setCategory}
            placeholder="Enter a category (optional)"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.infoText}>
            This flashcard will be added to the "{list?.title}" list
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#C7C7CC',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    minHeight: 50,
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CreateFlashcardScreen;
