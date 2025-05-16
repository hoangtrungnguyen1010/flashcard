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
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type CreateListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateList'>;
};

const COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#4CD964', // Green
  '#5AC8FA', // Light Blue
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D55', // Pink
];

const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your list');
      return;
    }

    // In a real app, you would save this to your data store
    // For now, we'll just navigate back
    Alert.alert(
      'List Created',
      'Your flashcard list has been created successfully!',
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
        <Text style={styles.headerTitle}>Create New List</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text 
            style={[
              styles.saveButtonText, 
              !title.trim() ? styles.disabledText : {}
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter list title"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textAreaInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter a description (optional)"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Choose a Color</Text>
          <View style={styles.colorPicker}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview</Text>
          <View style={[styles.preview, { backgroundColor: selectedColor + '15' }]}>
            <Text style={[styles.previewTitle, { color: selectedColor }]}>
              {title || 'List Title'}
            </Text>
            <Text style={styles.previewDescription} numberOfLines={2}>
              {description || 'List description will appear here'}
            </Text>
          </View>
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
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: Platform.OS === 'web' ? 'pointer' : 'default',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  previewContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  preview: {
    padding: 16,
    borderRadius: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default CreateListScreen;
