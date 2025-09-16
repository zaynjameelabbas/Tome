// Book Details Screen - Dynamic route for individual books
// File: app/book/[id].tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function BookDetailsScreen() {
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [readingStatus, setReadingStatus] = useState('Want to read');
  
  // Mock book data (in real app, you'd fetch based on the id parameter)
  const book = {
    id: id,
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    genres: ['Classics', 'Fantasy', 'Fiction'],
    rating: 4.8,
    totalRatings: 737,
    description: `"As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect. He was lying on his hard, as it was armour-plated, back and when he lifted his head a little he could see his dome-like brown belly divided into stiff arched segments..."`,
    publishedDate: '1915',
    pages: 201,
    language: 'English'
  };

  // Mock review data
  const review = {
    user: '@alfredo_',
    rating: 5,
    text: 'I recently delved into Franz Kafka\'s masterpiece, "The Metamorphosis," and I was utterly captivated from start to finish...',
    date: '2 weeks ago'
  };

  // Mock "readers also read" books
  const relatedBooks = [
    { id: '1', title: 'The Trial', author: 'Franz Kafka' },
    { id: '2', title: 'The Castle', author: 'Franz Kafka' },
    { id: '3', title: 'Amerika', author: 'Franz Kafka' },
    { id: '4', title: 'In the Penal Colony', author: 'Franz Kafka' }
  ];

  const handleStatusChange = () => {
    const statuses = ['Want to read', 'Reading', 'Read'];
    const currentIndex = statuses.indexOf(readingStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setReadingStatus(statuses[nextIndex]);
  };

  const handleBackPress = () => {
    router.back();
  };

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
          <View style={styles.bookCover} />
          
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            
            {/* Genre Tags */}
            <View style={styles.genreContainer}>
              {book.genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>★ {book.rating}</Text>
              <Text style={styles.ratingCount}>({book.totalRatings})</Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <View style={styles.reviewerAvatar} />
                <Text style={styles.reviewerName}>{review.user}</Text>
              </View>
              <View style={styles.reviewRating}>
                {[1,2,3,4,5].map((star) => (
                  <Text key={star} style={styles.reviewStar}>
                    {star <= review.rating ? '★' : '☆'}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        </View>

        {/* Readers Also Read */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Readers also read</Text>
          <View style={styles.relatedBooksGrid}>
            {relatedBooks.map((relatedBook) => (
              <TouchableOpacity 
                key={relatedBook.id} 
                style={styles.relatedBookCard}
                onPress={() => router.push(`/book/${relatedBook.id}`)}
              >
                <View style={styles.relatedBookCover} />
              </TouchableOpacity>
            ))}
          </View>
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
});