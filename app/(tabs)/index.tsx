// Home screen with real Google Books API data integration
// Shows "Did you read today?", featured books, and popular reads sections

// React import for component creation
import React, { useState, useEffect } from 'react';

// React Native core components
import { 
  View,           
  Text,           
  StyleSheet,     
  ScrollView,     // Main vertical scroll
  FlatList,       // For horizontal book lists
  TouchableOpacity,
  Dimensions,
  Image,          // For real book covers
  ActivityIndicator // For loading states
} from 'react-native';

// SafeAreaView ensures content doesn't go under notch/status bar
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import our Google Books API service and types
import { getPopularBooks, searchBooks } from '../../src/services/googleBooksApi';
import { Book } from '../../src/types';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

// Main Home screen component matching Goodreads layout
export default function LibraryScreen() {
  
  const router = useRouter();
  
  // State for real book data
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real book data when component mounts
  useEffect(() => {
    loadBookData();
  }, []);

  const loadBookData = async () => {
    try {
      setIsLoading(true);
      
      // Load featured books (literary fiction and classics)
      const featured = await searchBooks('literary fiction classics', 6);
      setFeaturedBooks(featured);
      
      // Load popular books
      const popular = await getPopularBooks();
      setPopularBooks(popular);
      
    } catch (error) {
      console.error('Error loading book data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock data for "Did you read today?" section
  const todayReading = {
    hasRead: false,
    currentBook: {
      id: 'current1',
      title: 'Surrender',
      author: 'Bono', 
      coverUrl: null,
      currentPage: 133,
      totalPages: 576
    }
  };

  // Reading goal data
  const readingGoal = {
    year: 2025,
    current: 6,
    target: 20,
    endDate: '1st Jan/26',
    percentage: 30
  };

  // Render large featured book card with real data
  const renderFeaturedBook = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity 
      style={[styles.featuredCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.featuredCover} />
      ) : (
        <View style={styles.featuredCover} />
      )}
      <Text style={styles.featuredTitle} numberOfLines={3}>{item.title}</Text>
      <Text style={styles.featuredAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

  // Render smaller popular book card with real data
  const renderPopularBook = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity 
      style={[styles.popularCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.popularCover} />
      ) : (
        <View style={styles.popularCover} />
      )}
      <Text style={styles.popularTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.popularAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header with profile and notification */}
      <View style={styles.topHeader}>
        <View style={styles.profileSection}>
          <View style={styles.profilePic} />
          <Text style={styles.forYouText}>For you</Text>
          <Text style={styles.dropdownArrow}>⌄</Text>
        </View>
        <View style={styles.notificationDot} />
      </View>

      {/* Main scrollable content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        
        {/* "Did you read today?" Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Did you read today?</Text>
          
          {/* Days of week */}
          <View style={styles.daysContainer}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={[styles.dayCircle, index === 2 && styles.dayActive]}>
                <Text style={[styles.dayText, index === 2 && styles.dayTextActive]}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Reading buttons and current book */}
          <View style={styles.readingStatusContainer}>
            <TouchableOpacity style={styles.readButton}>
              <Text style={styles.readButtonText}>Yes, I've read</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.didntReadButton}>
              <Text style={styles.didntReadButtonText}>No, I didn't</Text>
            </TouchableOpacity>
            
            {/* Current book progress */}
            <View style={styles.currentBookContainer}>
              <View style={styles.currentBookCover} />
              <Text style={styles.currentBookProgress}>
                {todayReading.currentBook.currentPage} of {todayReading.currentBook.totalPages}
              </Text>
            </View>
          </View>
        </View>

        {/* "You may be interested" Section with real data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You may be interested</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00674F" />
              <Text style={styles.loadingText}>Loading books...</Text>
            </View>
          ) : (
            <FlatList
              data={featuredBooks}
              renderItem={renderFeaturedBook}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        {/* "Popular reads" Section with real data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular reads</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00674F" />
              <Text style={styles.loadingText}>Loading books...</Text>
            </View>
          ) : (
            <FlatList
              data={popularBooks}
              renderItem={renderPopularBook}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Dark theme styles matching Goodreads exactly
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',     // Very dark background
  },

  // Top header with profile
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Profile section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Profile picture
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3a3a3a',
    marginRight: 12,
  },

  // "For you" text
  forYouText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },

  // Dropdown arrow
  dropdownArrow: {
    color: '#ffffff',
    fontSize: 14,
  },

  // Notification dot
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00674F',     // Rich emerald green
  },

  // Main scrollable content
  mainContent: {
    flex: 1,
  },

  // Section container
  section: {
    marginBottom: 32,
  },

  // Section titles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  // Days of week container
  daysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  // Individual day circle
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Active day circle
  dayActive: {
    backgroundColor: '#00674F',     // Rich emerald green
  },

  // Day text
  dayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Active day text
  dayTextActive: {
    color: '#000000',
  },

  // Reading status container
  readingStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // "Yes, I've read" button
  readButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },

  // Read button text
  readButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },

  // "No, I didn't" button
  didntReadButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    marginRight: 12,
  },

  // Didn't read button text
  didntReadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Current book container
  currentBookContainer: {
    alignItems: 'center',
    marginLeft: 'auto',
  },

  // Current book cover
  currentBookCover: {
    width: 40,
    height: 56,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    marginBottom: 4,
  },

  // Current book progress text
  currentBookProgress: {
    color: '#ffffff',
    fontSize: 12,
  },

  // Horizontal list container
  horizontalList: {
    paddingRight: 24,
  },

  // Featured book card (large)
  featuredCard: {
    width: 140,
    marginRight: 12,
  },

  // Featured book cover
  featuredCover: {
    width: 140,
    height: 210,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 12,
  },

  // Featured book title
  featuredTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },

  // Featured book author
  featuredAuthor: {
    color: '#888888',
    fontSize: 12,
  },

  // Popular book card (smaller)
  popularCard: {
    width: 100,
    marginRight: 12,
  },

  // Popular book cover
  popularCover: {
    width: 100,
    height: 150,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 8,
  },

  // Popular book title
  popularTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: 16,
  },

  // Popular book author
  popularAuthor: {
    color: '#888888',
    fontSize: 10,
  },

  // Loading states
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },

  loadingText: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 8,
  },
});