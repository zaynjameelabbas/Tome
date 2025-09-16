// Book Details Screen - Dynamic route for individual books
// File: app/book/[id].tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getBookById, getRecommendations } from '../../src/services/googleBooksApi';
import { Book } from '../../src/types';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function BookDetailsScreen() {
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [readingStatus, setReadingStatus] = useState('Want to read');
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load book data when component mounts
  useEffect(() => {
    if (id) {
      loadBookData(id);
    }
  }, [id]);

  const loadBookData = async (bookId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the main book data
      const bookData = await getBookById(bookId);
      
      if (bookData) {
        setBook(bookData);
        
        // Load recommendations based on this book
        const recommendations = await getRecommendations(bookData);
        setRelatedBooks(recommendations);
      } else {
        setError('Book not found');
      }
      
    } catch (error) {
      console.error('Error loading book:', error);
      setError('Failed to load book details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = () => {
    const statuses = ['Want to read', 'Reading', 'Read'];
    const currentIndex = statuses.indexOf(readingStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setReadingStatus(statuses[nextIndex]);
  };

  const handleBackPress = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00674F" />
          <Text style={styles.loadingText}>Loading book details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Book not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.statusButton} onPress={handleStatusChange}>
          <Text style={styles.statusText}>{readingStatus}</Text>
          <Text style={styles.dropdownArrow}>⌄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Book Cover and Main Info */}
        <View style={styles.bookSection}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.bookCover} />
          ) : (
            <View style={styles.bookCover} />
          )}
          
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            
            {/* Genre Tags */}
            {book.categories.length > 0 && (
              <View style={styles.genreContainer}>
                {book.categories.slice(0, 3).map((genre, index) => (
                  <View key={index} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Rating */}
            {book.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>★ {book.rating.toFixed(1)}</Text>
                {book.ratingsCount && (
                  <Text style={styles.ratingCount}>({book.ratingsCount})</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Info Section */}
        {book.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Info</Text>
            <Text style={styles.description}>{book.summary}</Text>
            
            {/* Additional book details */}
            <View style={styles.detailsContainer}>
              {book.publishedDate && (
                <Text style={styles.detailText}>Published: {book.publishedDate}</Text>
              )}
              {book.pageCount && (
                <Text style={styles.detailText}>Pages: {book.pageCount}</Text>
              )}
            </View>
          </View>
        )}

        {/* Readers Also Read */}
        {relatedBooks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Readers also read</Text>
            <View style={styles.relatedBooksGrid}>
              {relatedBooks.slice(0, 4).map((relatedBook) => (
                <TouchableOpacity 
                  key={relatedBook.id} 
                  style={styles.relatedBookCard}
                  onPress={() => router.push(`/book/${relatedBook.id}`)}
                >
                  {relatedBook.coverUrl ? (
                    <Image source={{ uri: relatedBook.coverUrl }} style={styles.relatedBookCover} />
                  ) : (
                    <View style={styles.relatedBookCover} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },

  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },

  dropdownArrow: {
    color: '#ffffff',
    fontSize: 12,
  },

  content: {
    flex: 1,
  },

  bookSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  bookCover: {
    width: 200,
    height: 300,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  bookInfo: {
    alignItems: 'center',
  },

  bookTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },

  bookAuthor: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 16,
  },

  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },

  genreTag: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  genreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingStars: {
    fontSize: 16,
    color: '#00674F',
    fontWeight: '600',
    marginRight: 8,
  },

  ratingCount: {
    fontSize: 14,
    color: '#888888',
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },

  description: {
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 22,
  },

  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  viewAllText: {
    color: '#00674F',
    fontSize: 14,
    fontWeight: '500',
  },

  reviewCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    marginRight: 8,
  },

  reviewerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  reviewRating: {
    flexDirection: 'row',
  },

  reviewStar: {
    fontSize: 14,
    color: '#00674F',
    marginHorizontal: 1,
  },

  reviewText: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
  },

  relatedBooksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  relatedBookCard: {
    width: (width - 72) / 4,
    marginBottom: 16,
  },

  relatedBookCover: {
    width: '100%',
    height: ((width - 72) / 4) * 1.5,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  loadingText: {
    color: '#888888',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },

  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },

  backButtonText: {
    color: '#00674F',
    fontSize: 16,
    fontWeight: '600',
  },

  // Additional details
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },

  detailText: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 8,
  },
});