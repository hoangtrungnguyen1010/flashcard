import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type FlashcardScreenProps = {
  route: RouteProp<RootStackParamList, 'Flashcard'>;
  navigation: StackNavigationProp<RootStackParamList, 'Flashcard'>;
};

const { width, height } = Dimensions.get('window');

const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ route, navigation }) => {
  const { flashcard } = route.params;
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    // Simple flip animation
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const frontAnimatedStyle = {
    transform: [
      { rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        })
      }
    ]
  };

  const backAnimatedStyle = {
    transform: [
      { rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '0deg'],
        })
      }
    ]
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      {/* Header with back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="arrow-back" size={28} color="#007AFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* Front Card */}
        <Animated.View 
          style={[
            styles.card,
            frontAnimatedStyle,
            { opacity: isFlipped ? 0 : 1 }
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.category}>{flashcard.category}</Text>
            <Text style={styles.questionText}>{flashcard.question}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={flipCard}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.flipButtonText}>Tap to see answer</Text>
            <Ionicons name="sync" size={20} color="#007AFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Back Card */}
        <Animated.View 
          style={[
            styles.card,
            styles.backCard,
            backAnimatedStyle,
            { opacity: isFlipped ? 1 : 0 }
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.category}>{flashcard.category}</Text>
            <Text style={styles.answerText}>{flashcard.answer}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={flipCard}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.flipButtonText}>Tap to see question</Text>
            <Ionicons name="sync" size={20} color="#007AFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {/* Bottom Button */}
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        activeOpacity={0.7}
      >
        <Ionicons name="close-circle" size={30} color="#FF3B30" />
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 40,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#007AFF',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: height * 0.5,
    maxHeight: 400,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
  },
  backCard: {
    backgroundColor: '#F0F8FF',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  category: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  answerText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  flipButtonText: {
    color: '#007AFF',
    marginRight: 8,
    fontSize: 16,
  },
  closeButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButtonText: {
    marginTop: 4,
    fontSize: 14,
    color: '#FF3B30',
  },
});

export default FlashcardScreen;