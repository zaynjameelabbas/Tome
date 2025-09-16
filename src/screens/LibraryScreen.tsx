import React from "react";
import {View,Text,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function LibraryScreen() {

    // TEMPORARY: Mock data to test our UI before we connect real database
    // Later this will come from our state management (Zustand) and local database
    const mockBooks = [
        { id: '1', title: 'The Design of Everyday Things', author: 'Don Norman' },
        { id: '2', title: 'Atomic Habits', author: 'James Clear' },
        { id: '3', title: 'The Pragmatic Programmer', author: 'Andy Hunt' },
    ];

    // This function defines how each book item should look in our list
    // FlatList calls this function for each book in our mockBooks array
    const renderBookItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.bookItem}
                // Later we'll add: onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
        >
            {/* Placeholder for book cover image - will be replaced with actual cover later */}
            <View style={styles.bookCover} />
      
            {/* Container for book text information */}
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
        </TouchableOpacity>
    );

    // The main component structure (what gets displayed on screen)
    return (
        <SafeAreaView style={styles.container}>
        
        {/* Header section with title and book count */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Library</Text>
            <Text style={styles.bookCount}>{mockBooks.length} books</Text>
        </View>
        
        {/* Scrollable list of books */}
        <FlatList
            data={mockBooks}                              // The array of data to display
            renderItem={renderBookItem}                   // Function that renders each item
            keyExtractor={(item) => item.id}              // Tells React how to identify each item uniquely
            contentContainerStyle={styles.bookList}      // Styling for the list container
            showsVerticalScrollIndicator={false}          // Hides the scroll bar
        />
        </SafeAreaView>
    );
}

// StyleSheet.create() is React Native's way of creating styles
// It's similar to CSS but uses JavaScript objects
const styles = StyleSheet.create({
    // Main container - takes up full screen
    container: {
      flex: 1,                    // Takes up all available space (like height: 100vh in CSS)
      backgroundColor: '#fff',    // White background
    },
  
    // Header section styling
    header: {
      padding: 20,                      // Space inside the header (top, right, bottom, left)
      borderBottomWidth: 1,             // Adds a thin line at bottom
      borderBottomColor: '#f0f0f0',     // Light gray color for the border
    },
  
    // Main title styling ("My Library")
    headerTitle: {
      fontSize: 28,           // Large text size
      fontWeight: 'bold',     // Make it bold
      color: '#333',          // Dark gray color
      marginBottom: 4,        // Small space below the title
    },
  
    // Book count text styling ("3 books")
    bookCount: {
      fontSize: 16,           // Medium text size
      color: '#666',          // Medium gray color
    },
  
    // Container for the entire list of books
    bookList: {
      padding: 20,            // Space around the list content
    },
  
    // Individual book item container
    bookItem: {
      flexDirection: 'row',         // Arrange children horizontally (cover + text side by side)
      marginBottom: 16,             // Space between book items
      padding: 12,                  // Space inside each book item
      backgroundColor: '#f8f9fa',   // Very light gray background
      borderRadius: 8,              // Rounded corners
    },
  
    // Book cover placeholder styling
    bookCover: {
      width: 50,                  // Fixed width
      height: 70,                 // Fixed height (rectangular like a book)
      backgroundColor: '#ddd',    // Light gray placeholder color
      borderRadius: 4,            // Slightly rounded corners
      marginRight: 12,            // Space between cover and text
    },
  
    // Container for book title and author
    bookInfo: {
      flex: 1,                    // Takes up remaining space after cover
      justifyContent: 'center',   // Centers the text vertically
    },
  
    // Book title text styling
    bookTitle: {
      fontSize: 16,           // Medium text size
      fontWeight: '600',      // Semi-bold
      color: '#333',          // Dark gray
      marginBottom: 4,        // Small space below title
    },
  
    // Book author text styling
    bookAuthor: {
      fontSize: 14,           // Smaller than title
      color: '#666',          // Medium gray (less prominent than title)
    },
  });