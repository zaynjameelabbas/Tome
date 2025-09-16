// Firebase configuration and initialization
// Handles authentication, Firestore database, and app initialization

import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your Firebase config (you'll get this from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyCaiN7cOPLoMpfi06l1LqaIP71-BrWuazg",
    authDomain: "tome-bfe30.firebaseapp.com",
    projectId: "tome-bfe30",
    storageBucket: "tome-bfe30.firebasestorage.app",
    messagingSenderId: "198381595579",
    appId: "1:198381595579:web:9ae2e00a809d7e8129329e",
    measurementId: "G-XY7XGJT6VY"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export default app;