import React from 'react';
import { 
  View,           
  Text,           
  StyleSheet,     
  ScrollView,
  TouchableOpacity,
  FlatList,        // Added for horizontal scrolling
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function LibraryTab() {
    const router = useRouter();
    // Three reading categories - each gets its own full row
    const readingCategories = [
        { 
        title: 'Want to read', 
        count: 7,
        books: Array.from({length: 8}, (_, i) => ({ id: `want-${i}`, title: `Book ${i+1}` }))
        },
        { 
        title: 'Reading', 
        count: 2,
        books: Array.from({length: 5}, (_, i) => ({ id: `reading-${i}`, title: `Book ${i+1}` }))
        },
        { 
        title: 'Read', 
        count: 15,
        books: Array.from({length: 20}, (_, i) => ({ id: `read-${i}`, title: `Book ${i+1}` }))
        },
    ];

    // Reading goal
    const readingGoal = {
        year: 2025,
        current: 6,
        target: 20,
        endDate: '1st Jan/26',
        percentage: 30
    };

    // Render individual book for horizontal scroll (like home page)
    const renderBook = ({ item, index }: { item: any, index: number }) => (
        <TouchableOpacity 
            style={[styles.bookCard, { marginLeft: index === 0 ? 24 : 12 }]}
            onPress={() => router.push(`/book/${item.id}`)}
        >
        <View style={styles.bookCover} />
        <Text style={styles.bookTitle} numberOfLines={2}>Sample Book Title</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>Author Name</Text>
        </TouchableOpacity>
    );

    // Render each category as a section with horizontal scroll
    const renderCategoryRow = (category: any, index: number) => (
        <View key={index} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>{category.count} Books</Text>
        </View>
        
        {/* Horizontal scrolling books list */}
        <FlatList
            data={category.books}
            renderItem={renderBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
        />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
        
        {/* Search icon */}
        <View style={styles.header}>
            <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Reading category rows */}
            <View style={styles.categoriesSection}>
            {readingCategories.map(renderCategoryRow)}
            </View>

            {/* Reading Goals */}
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading goals</Text>
            
            <View style={styles.goalCard}>
                <View style={styles.goalHeader}>
                <View style={styles.goalTextContainer}>
                    <Text style={styles.goalTitle}>{readingGoal.year} Reading Challenge</Text>
                    <Text style={styles.goalSubtext}>
                    {readingGoal.current} of {readingGoal.target} • Ends {readingGoal.endDate}
                    </Text>
                </View>
                <View style={styles.goalIcon}>
                    <Text style={styles.goalIconText}>📊</Text>
                </View>
                </View>
                
                <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{readingGoal.percentage}%</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${readingGoal.percentage}%` }]} />
                </View>
                </View>
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

  // Header with search
  header: {
    paddingLeft: 24,
    paddingVertical: 16,
  },

  searchButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchIcon: {
    fontSize: 16,
    color: '#ffffff',
  },

  content: {
    flex: 1,
  },

  // Categories section
  categoriesSection: {
    marginBottom: 40,
  },

  // Each category section (like home page sections)
  categorySection: {
    marginBottom: 32,
  },

  categoryHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  categoryTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },

  categoryCount: {
    color: '#888888',
    fontSize: 14,
  },

  // Horizontal list styling
  horizontalList: {
    paddingRight: 24,
  },

  // Individual book card (matching home page style)
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
  },

  // Reading goals section
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
  },

  // Reading goal card
  goalCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  goalTextContainer: {
    flex: 1,
  },

  goalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  goalSubtext: {
    color: '#888888',
    fontSize: 12,
  },

  goalIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#00674F',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalIconText: {
    fontSize: 16,
  },

  // Progress bar
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressText: {
    color: '#00674F',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 35,
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#00674F',
    borderRadius: 3,
  },
});