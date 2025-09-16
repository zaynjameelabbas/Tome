// React import for component creation
import React from 'react';

// React Native components for UI
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,      // For search input field
  ScrollView      // For scrollable content
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder search screen
// Later this will connect to Google Books API and our local database
export default function SearchScreen() {
    return (
        <SafeAreaView style={styles.container}>
        
        {/* Header with search input */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Search Books</Text>
            
            {/* Search input field - placeholder for now */}
            <TextInput
            style={styles.searchInput}
            placeholder="Search by title, author, or ISBN..."
            placeholderTextColor="#999"
            // Later we'll add: onChangeText, value, and search functionality
            />
        </View>

        {/* Scrollable content area */}
        <ScrollView style={styles.content}>
            
            {/* Placeholder content */}
            <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🔍</Text>
            <Text style={styles.placeholderTitle}>Discover New Books</Text>
            <Text style={styles.placeholderText}>
                Search our database of millions of books or add new ones manually.
            </Text>
            </View>

            {/* Future sections will include: */}
            {/* - Recent searches */}
            {/* - Popular books */}
            {/* - AI-recommended books */}
            {/* - Search results */}
            
        </ScrollView>
        </SafeAreaView>
    );
}

// Styles for the search screen
const styles = StyleSheet.create({
    // Main container
    container: {
        flex: 1,                    // Full screen height
        backgroundColor: '#fff',    // White background
    },

    // Header section with title and search
    header: {
        padding: 20,                      // Space around header content
        borderBottomWidth: 1,             // Bottom border line
        borderBottomColor: '#f0f0f0',     // Light gray border color
    },

    // Header title styling
    headerTitle: {
        fontSize: 28,           // Large title text
        fontWeight: 'bold',     // Bold font weight
        color: '#333',          // Dark gray color
        marginBottom: 16,       // Space below title
    },

    // Search input field styling
    searchInput: {
        height: 44,                     // Fixed height for touch target
        borderWidth: 1,                 // Border around input
        borderColor: '#ddd',            // Light gray border
        borderRadius: 8,                // Rounded corners
        paddingHorizontal: 16,          // Horizontal padding inside input
        fontSize: 16,                   // Text size
        backgroundColor: '#f8f9fa',     // Very light gray background
    },

    // Main content area
    content: {
        flex: 1,                // Take remaining space
    },

    // Placeholder content container
    placeholder: {
        flex: 1,                        // Take available space
        alignItems: 'center',           // Center horizontally
        justifyContent: 'center',       // Center vertically
        padding: 40,                    // Space around content
        marginTop: 60,                  // Push down from top
    },

    // Large icon for placeholder
    placeholderIcon: {
        fontSize: 48,           // Large icon size
        marginBottom: 20,       // Space below icon
    },

    // Placeholder title
    placeholderTitle: {
        fontSize: 20,               // Medium-large text
        fontWeight: '600',          // Semi-bold
        color: '#333',              // Dark gray
        marginBottom: 12,           // Space below title
    },

    // Placeholder description text
    placeholderText: {
        fontSize: 16,               // Medium text size
        color: '#666',              // Medium gray
        textAlign: 'center',        // Center text alignment
        lineHeight: 24,             // Line height for readability
    },
});