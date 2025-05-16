import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';

import FlashcardScreen from '../screens/FlashcardScreen';
import FlashcardListScreen from '../screens/FlashcardListScreen';
import CreateFlashcardScreen from '../screens/CreateFlashcardScreen';
import CreateListScreen from '../screens/CreateListScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Flashcard" 
          component={FlashcardScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FlashcardList" 
          component={FlashcardListScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CreateFlashcard" 
          component={CreateFlashcardScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CreateList" 
          component={CreateListScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResultsScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
