// Search screen with real Google Books API integration
// Now fetches actual book data instead of mock data

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import our Google Books API service
import { searchBooks, getPopularBooks } from '../../src/services/googleBooksApi';
import { Book } from '../../src/types';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function SearchScreen() {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryBooks, setCategoryBooks] = useState<{ [key: string]: Book[] }>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const router = useRouter();

  // Load popular books when component mounts
  useEffect(() => {
    loadPopularBooks();
    loadRecommendedBooks();
  }, []);

  const loadPopularBooks = async () => {
    try {
      const books = await getPopularBooks();
      setPopularBooks(books);
    } catch (error) {
      console.error('Error loading popular books:', error);
    }
  };

  // Mock recommendations for now (later we'll base this on user's reading history)
  const loadRecommendedBooks = async () => {
    try {
      const books = await searchBooks('Franz Kafka', 4);
      setRecommendedBooks(books);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchBooks(searchQuery, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  // Clear search and return to discover page
  const handleBackToDiscover = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

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

  // Render search result book
  const renderSearchResult = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      style={styles.searchResultCard}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.searchResultCover} />
      ) : (
        <View style={styles.searchResultCover} />
      )}
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.searchResultAuthor} numberOfLines={1}>{item.author}</Text>
        {item.rating && (
          <Text style={styles.searchResultRating}>★ {item.rating.toFixed(1)}</Text>
        )}
        {item.summary && (
          <Text style={styles.searchResultDescription} numberOfLines={2}>
            {item.summary}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render recommended book with real data
  const renderRecommendedBook = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity 
      style={[styles.bookCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} />
      ) : (
        <View style={styles.bookCover} />
      )}
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
      <Text style={styles.recommendationReason} numberOfLines={2}>
        Because you read The Metamorphosis
      </Text>
    </TouchableOpacity>
  );

  // Render popular book with real data
  const renderPopularBook = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity 
      style={[styles.bookCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} />
      ) : (
        <View style={styles.bookCover} />
      )}
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
      {item.rating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // renderCategory function:
  const renderCategory = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedCategories.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.categoryCard, 
          { 
            marginLeft: index === 0 ? 24 : 12,
            backgroundColor: isSelected ? item.color : item.color + '20',
            borderColor: item.color + (isSelected ? 'FF' : '40'),
          }
        ]}
        onPress={() => handleCategoryPress(item)}
      >
        <Text style={[
          styles.categoryName, 
          { color: isSelected ? '#ffffff' : item.color }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Load books for a specific category
  const loadCategoryBooks = async (categoryId: string, categoryName: string) => {
    try {
      const books = await searchBooks(`subject:${categoryName}`, 10);
      setCategoryBooks(prev => ({ ...prev, [categoryId]: books }));
    } catch (error) {
      console.error(`Error loading ${categoryName} books:`, error);
    }
  };

  // Handle category selection
  const handleCategoryPress = async (category: { id: string; name: string }) => {
    if (selectedCategories.includes(category.id)) {
      // Remove category if already selected
      setSelectedCategories(prev => prev.filter(id => id !== category.id));
    } else {
      // Add category and load books
      setSelectedCategories(prev => [...prev, category.id]);
      if (!categoryBooks[category.id]) {
        await loadCategoryBooks(category.id, category.name);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header with search */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {/* Back arrow - only show when there are search results */}
          {searchResults.length > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBackToDiscover}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          
          <Text style={[
            styles.headerTitle,
            { marginLeft: searchResults.length > 0 ? 12 : 0 }
          ]}>
            {searchResults.length > 0 ? 'Search Results' : 'Discover'}
          </Text>
        </View>
        
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
        
        {/* Search Results - only show when there are results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00674F" />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.searchResultsList}
              />
            )}
          </View>
        )}

        {/* Show recommendation sections only when no search results */}
        {searchResults.length === 0 && (
          <>
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

            {/* Add this right after the Browse Categories FlatList */}
            {/* Selected Category Books - show horizontal rows for each selected category */}
            {selectedCategories.map((categoryId) => {
              const category = categories.find(cat => cat.id === categoryId);
              const books = categoryBooks[categoryId];
              
              if (!category || !books || books.length === 0) return null;
              
              return (
                <View key={categoryId} style={styles.section}>
                  <Text style={styles.sectionTitle}>{category.name}</Text>
                  <FlatList
                    data={books}
                    renderItem={renderPopularBook}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                  />
                </View>
              );
            })}
          </>
        )}

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

  // Title row with optional back button
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Back button
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '300',
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
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

  // Search results styles
  searchResultsList: {
    paddingHorizontal: 24,
  },

  searchResultCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#161b22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#21262d',
  },

  searchResultCover: {
    width: 60,
    height: 90,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    marginRight: 16,
  },

  searchResultInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  searchResultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },

  searchResultAuthor: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 4,
  },

  searchResultRating: {
    color: '#00674F',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },

  searchResultDescription: {
    color: '#cccccc',
    fontSize: 12,
    lineHeight: 16,
  },

  // Loading states
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  loadingText: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 8,
  },
});