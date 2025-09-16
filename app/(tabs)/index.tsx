// Library screen inspired by Goodreads dark theme layout
// This recreates the card-based, sectioned design with horizontal scrolling

// React import for component creation
import React from 'react';

// React Native core components
import { 
  View,           
  Text,           
  StyleSheet,     
  ScrollView,     // Main vertical scroll
  FlatList,       // For horizontal book lists
  TouchableOpacity,
  Dimensions
} from 'react-native';

// SafeAreaView ensures content doesn't go under notch/status bar
import { SafeAreaView } from 'react-native-safe-area-context';

// Import our types
import { Book } from '../../src/types';

import { useRouter } from 'expo-router';


// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

// Main Library screen component matching Goodreads layout
export default function LibraryScreen() {
  
  const router = useRouter();
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

  // Mock data for "You may be interested" - larger featured books
  const featuredBooks: Book[] = [
    {
      id: 'feat1',
      title: 'Steal Like an Artist',
      author: 'Austin Kleon',
      categories: ['Creativity', 'Art'],
      dateAdded: new Date(),
      rating: 4,
    },
    {
      id: 'feat2', 
      title: 'The Creative Act: A Way of Being',
      author: 'Rick Rubin',
      categories: ['Creativity', 'Philosophy'],
      dateAdded: new Date(),
      rating: 5,
    },
    {
      id: 'feat3',
      title: 'On Writing',
      author: 'Stephen King',
      categories: ['Writing', 'Memoir'],
      dateAdded: new Date(),
      rating: 5,
    }
  ];

  // Mock data for "Popular reads" - smaller horizontal scroll
  const popularBooks: Book[] = [
    {
      id: 'pop1',
      title: 'Frank Herbert\'s Dune',
      author: 'Frank Herbert',
      categories: ['Science Fiction'],
      dateAdded: new Date(),
      rating: 5,
    },
    {
      id: 'pop2',
      title: 'The Lion, The Witch and the Wardrobe',
      author: 'C.S. Lewis',
      categories: ['Fantasy', 'Classic'],
      dateAdded: new Date(),
      rating: 4,
    },
    {
      id: 'pop3',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      categories: ['Science Fiction'],
      dateAdded: new Date(),
      rating: 5,
    }
  ];

  // Render large featured book card
  const renderFeaturedBook = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity 
      style={[styles.featuredCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}  // Add this line
    >
      <View style={styles.featuredCover} />
      <Text style={styles.featuredTitle} numberOfLines={3}>{item.title}</Text>
      <Text style={styles.featuredAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

  // Render smaller popular book card
  const renderPopularBook = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity 
      style={[styles.popularCard, { marginLeft: index === 0 ? 24 : 12 }]}
      onPress={() => router.push(`/book/${item.id}`)}  // Add this line
    >
      <View style={styles.popularCover} />
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

        {/* "You may be interested" Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You may be interested</Text>
          <FlatList
            data={featuredBooks}
            renderItem={renderFeaturedBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* "Popular reads" Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular reads</Text>
          <FlatList
            data={popularBooks}
            renderItem={renderPopularBook}
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
});