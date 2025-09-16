// Search screen with recommendations, popular books, and categories
// Matches home page styling with horizontal scrolling sections

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function SearchScreen() {
  
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  // Recommendations based on recently read books
  const recommendedBooks = [
    {
      id: 'rec1',
      title: 'The Stranger',
      author: 'Albert Camus',
      reason: 'Because you read The Metamorphosis',
    },
    {
      id: 'rec2',
      title: '1984',
      author: 'George Orwell',
      reason: 'Readers of Kafka also enjoyed',
    },
    {
      id: 'rec3',
      title: 'The Trial',
      author: 'Franz Kafka',
      reason: 'More by Franz Kafka',
    },
    {
      id: 'rec4',
      title: 'Brave New World',
      author: 'Aldous Huxley',
      reason: 'Similar themes',
    }
  ];

  // Popular books
  const popularBooks = [
    {
      id: 'pop1',
      title: 'Fourth Wing',
      author: 'Rebecca Yarros',
      rating: 4.5,
    },
    {
      id: 'pop2',
      title: 'Tomorrow, and Tomorrow, and Tomorrow',
      author: 'Gabrielle Zevin',
      rating: 4.3,
    },
    {
      id: 'pop3',
      title: 'Lessons in Chemistry',
      author: 'Bonnie Garmus',
      rating: 4.4,
    },
    {
      id: 'pop4',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      rating: 4.6,
    }
  ];

  // Categories
  const categories = [
    { id: 'fiction', name: 'Fiction', color: '#FF6B6B' },
    { id: 'mystery', name: 'Mystery & Thriller', color: '#4ECDC4' },
    { id: 'romance', name: 'Romance', color: '#45B7D1' },
    { id: 'fantasy', name: 'Fantasy', color: '#96CEB4' },
    { id: 'scifi', name: 'Science Fiction', color: '#FFEAA7' },
    { id: 'biography', name: 'Biography', color: '#DDA0DD' },
    { id: 'history', name: 'History', color: '#98D8C8' },
    { id: 'selfhelp', name: 'Self Help', color: '#F7DC6F' }
  ];

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  // Render recommended book
  const renderRecommendedBook = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={[styles.bookCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      <View style={styles.bookCover} />
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
      <Text style={styles.recommendationReason} numberOfLines={2}>{item.reason}</Text>
    </TouchableOpacity>
  );

  // Render popular book
  const renderPopularBook = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={[styles.bookCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      <View style={styles.bookCover} />
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>★ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render category
  const renderCategory = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { 
          marginLeft: index === 0 ? 24 : 12,
          backgroundColor: item.color + '20', // 20% opacity
          borderColor: item.color + '40', // 40% opacity
        }
      ]}
    >
      <Text style={[styles.categoryName, { color: item.color }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header with search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors, ISBN..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Recommended for You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <FlatList
            data={recommendedBooks}
            renderItem={renderRecommendedBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Popular Right Now */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Right Now</Text>
          <FlatList
            data={popularBooks}
            renderItem={renderPopularBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Browse Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },

  // Header section
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#0f0f0f',
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  // Search container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#21262d',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#161b22',
    marginRight: 12,
    color: '#f0f6fc',
  },

  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: '#00674F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00674F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },

  searchButtonText: {
    fontSize: 18,
  },

  // Main content
  content: {
    flex: 1,
  },

  // Section styling
  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  // Horizontal list
  horizontalList: {
    paddingRight: 24,
  },

  // Book card styling (matching home page)
  bookCard: {
    width: 140,
    marginRight: 12,
  },

  bookCover: {
    width: 140,
    height: 210,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 12,
  },

  bookTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },

  bookAuthor: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },

  // Recommendation reason
  recommendationReason: {
    color: '#00674F',
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 14,
  },

  // Rating container
  ratingContainer: {
    marginTop: 2,
  },

  rating: {
    color: '#00674F',
    fontSize: 12,
    fontWeight: '500',
  },

  // Category card
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
});