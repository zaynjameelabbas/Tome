// Scan screen for capturing book information using device camera
// File name "scan.tsx" automatically creates a tab in Expo Router

// React import for component creation
import React from 'react';

// React Native components for UI
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Main scan screen component
// Later this will integrate with expo-camera and AI recognition
export default function ScanScreen() {
  
  // Placeholder function for future camera functionality
  const handleStartScanning = () => {
    // TODO: Open camera and start scanning
    console.log('Opening camera for book scanning...');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan Books</Text>
        <Text style={styles.headerSubtitle}>
          Add books instantly by scanning their covers
        </Text>
      </View>

      {/* Main content area */}
      <View style={styles.content}>
        
        {/* Camera preview placeholder */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            
            {/* Camera icon and text */}
            <Text style={styles.cameraIcon}>📸</Text>
            <Text style={styles.cameraText}>Camera Preview</Text>
            <Text style={styles.cameraSubtext}>
              Point your camera at a book
            </Text>
            
            {/* Scanning frame overlay */}
            <View style={styles.scanFrame} />
            
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How to scan:</Text>
          <Text style={styles.instructionText}>
            • Position the book cover clearly in the frame{'\n'}
            • Ensure good lighting for best results{'\n'}
            • Hold steady until recognition completes
          </Text>
        </View>

        {/* Scan button */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleStartScanning}
        >
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
        
        {/* Manual entry option */}
        <TouchableOpacity style={styles.manualButton}>
          <Text style={styles.manualButtonText}>Enter book details manually</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

// Styles for the scan screen
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,                    // Full screen height
    backgroundColor: '#fff',    // White background
  },

  // Header section styling
  header: {
    padding: 20,                      // Space around header
    borderBottomWidth: 1,             // Bottom border
    borderBottomColor: '#f0f0f0',     // Light gray border
  },

  // Main header title
  headerTitle: {
    fontSize: 28,           // Large title
    fontWeight: 'bold',     // Bold text
    color: '#333',          // Dark gray
    marginBottom: 4,        // Space below
  },

  // Header subtitle
  headerSubtitle: {
    fontSize: 16,           // Medium size
    color: '#666',          // Gray text
  },

  // Main content container
  content: {
    flex: 1,                        // Take remaining space
    padding: 20,                    // Space around content
    alignItems: 'center',           // Center horizontally
  },

  // Camera preview container
  cameraContainer: {
    width: '100%',                  // Full width
    aspectRatio: 4/3,               // Camera aspect ratio
    marginBottom: 20,               // Space below
  },

  // Camera placeholder
  cameraPlaceholder: {
    flex: 1,                        // Fill container
    backgroundColor: '#f5f5f5',     // Light gray background
    borderRadius: 12,               // Rounded corners
    alignItems: 'center',           // Center content horizontally
    justifyContent: 'center',       // Center content vertically
    position: 'relative',           // For absolute positioned children
    borderWidth: 2,                 // Border thickness
    borderColor: '#ddd',            // Gray border
    borderStyle: 'dashed',          // Dashed border style
  },

  // Camera icon
  cameraIcon: {
    fontSize: 48,           // Large icon
    marginBottom: 8,        // Space below
  },

  // Camera text
  cameraText: {
    fontSize: 18,               // Medium-large text
    fontWeight: '600',          // Semi-bold
    color: '#333',              // Dark gray
    marginBottom: 4,            // Space below
  },

  // Camera subtext
  cameraSubtext: {
    fontSize: 14,           // Smaller text
    color: '#666',          // Gray color
    textAlign: 'center',    // Center text
  },

  // Scanning frame overlay
  scanFrame: {
    position: 'absolute',           // Position over camera view
    top: '30%',                     // Position from top
    left: '20%',                    // Position from left
    right: '20%',                   // Position from right
    bottom: '30%',                  // Position from bottom
    borderWidth: 2,                 // Frame thickness
    borderColor: '#007AFF',         // iOS blue
    borderRadius: 8,                // Rounded corners
  },

  // Instructions section
  instructions: {
    width: '100%',                  // Full width
    marginBottom: 30,               // Space below
  },

  // Instructions title
  instructionTitle: {
    fontSize: 18,               // Medium-large size
    fontWeight: '600',          // Semi-bold
    color: '#333',              // Dark gray
    marginBottom: 8,            // Space below
  },

  // Instructions text
  instructionText: {
    fontSize: 14,               // Medium text size
    color: '#666',              // Gray color
    lineHeight: 20,             // Line spacing
  },

  // Primary scan button
  scanButton: {
    backgroundColor: '#007AFF',     // iOS blue
    paddingHorizontal: 32,          // Horizontal padding
    paddingVertical: 16,            // Vertical padding
    borderRadius: 8,                // Rounded corners
    marginBottom: 16,               // Space below
    minWidth: 200,                  // Minimum width
    alignItems: 'center',           // Center text
  },

  // Scan button text
  scanButtonText: {
    color: '#fff',              // White text
    fontSize: 16,               // Medium size
    fontWeight: '600',          // Semi-bold
  },

  // Manual entry button (secondary)
  manualButton: {
    paddingHorizontal: 16,          // Horizontal padding
    paddingVertical: 12,            // Vertical padding
  },

  // Manual button text
  manualButtonText: {
    color: '#007AFF',           // Blue text
    fontSize: 14,               // Smaller size
    textDecorationLine: 'underline', // Underlined
  },
});