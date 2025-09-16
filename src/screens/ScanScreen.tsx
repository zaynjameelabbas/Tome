// React import for component creation
import React from 'react';

// React Native components we need
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simple placeholder screen for book scanning functionality
// Later this will have camera access and AI-powered book recognition
export default function ScanScreen() {
    return (
        <SafeAreaView style={styles.container}>
        {/* Main content container */}
        <View style={styles.content}>
            
            {/* Screen title */}
            <Text style={styles.title}>Scan Books</Text>
            
            {/* Placeholder text explaining future functionality */}
            <Text style={styles.description}>
            Point your camera at a book to automatically add it to your library.
            </Text>
            
            {/* Placeholder for camera view */}
            <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraText}>📸</Text>
            <Text style={styles.cameraText}>Camera Preview</Text>
            </View>
            
            {/* Future: Camera component and scan button will go here */}
        </View>
        </SafeAreaView>
    );
}

// Styles for our scan screen
const styles = StyleSheet.create({
    // Main container taking full screen
    container: {
        flex: 1,                    // Full height
        backgroundColor: '#fff',    // White background
    },

    // Content wrapper with padding
    content: {
        flex: 1,                        // Take remaining space
        padding: 20,                    // Space around content
        alignItems: 'center',           // Center items horizontally
        justifyContent: 'center',       // Center items vertically
    },

    // Screen title styling
    title: {
        fontSize: 28,               // Large text
        fontWeight: 'bold',         // Bold font
        color: '#333',              // Dark gray
        marginBottom: 16,           // Space below title
    },

    // Description text styling
    description: {
        fontSize: 16,               // Medium text size
        color: '#666',              // Medium gray
        textAlign: 'center',        // Center the text
        marginBottom: 40,           // Space below description
        lineHeight: 24,             // Line spacing for readability
    },

    // Placeholder for camera view
    cameraPlaceholder: {
        width: 250,                     // Fixed width
        height: 250,                    // Square shape
        backgroundColor: '#f0f0f0',     // Light gray background
        borderRadius: 12,               // Rounded corners
        alignItems: 'center',           // Center content horizontally
        justifyContent: 'center',       // Center content vertically
        borderWidth: 2,                 // Border thickness
        borderColor: '#ddd',            // Light gray border
        borderStyle: 'dashed',          // Dashed border style
    },

    // Text inside camera placeholder
    cameraText: {
        fontSize: 18,               // Medium-large text
        color: '#999',              // Light gray text
        textAlign: 'center',        // Centered text
        marginVertical: 4,          // Small vertical spacing
    },
});