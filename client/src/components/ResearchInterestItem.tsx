// src/components/ResearchInterestItem.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Interest } from '../types/navigation';

interface ResearchInterestItemProps {
  interest: Interest;
  onUpdate: (interest: Interest) => void;
  onDelete: (id: string) => void;
}

const ResearchInterestItem: React.FC<ResearchInterestItemProps> = ({ interest, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [text, setText] = useState<string>(interest.title);

  const handleSave = () => {
    onUpdate({ ...interest, title: text });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
          />
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.button}
            activeOpacity={0.6}
          >
            <Ionicons name="checkmark" size={24} color="green" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.displayContainer}>
          <Text style={styles.text}>{interest.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity 
              onPress={() => setIsEditing(true)} 
              style={styles.button}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="create-outline" size={22} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => onDelete(interest.id)} 
              style={styles.button}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    padding: 8,
    marginLeft: 10,
  },
});

export default ResearchInterestItem;
