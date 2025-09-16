// Firebase Authentication service
// Handles user registration, login, logout, and auth state management

import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User,
    AuthError
  } from 'firebase/auth';
  import { auth } from './firebase';
  import { createUserProfile } from './database';
  
  // Auth result interface
  export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
  }
  
  // Sign up with email and password
  export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Create user profile in Firestore
      await createUserProfile(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Error signing up:', error);
      return { 
        success: false, 
        error: getAuthErrorMessage(error as AuthError)
      };
    }
  };
  
  // Sign in with email and password
  export const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing in:', error);
      return { 
        success: false, 
        error: getAuthErrorMessage(error as AuthError)
      };
    }
  };
  
  // Sign out
  export const signOutUser = async (): Promise<AuthResult> => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { 
        success: false, 
        error: 'Failed to sign out'
      };
    }
  };
  
  // Get current user
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  
  // Auth state listener
  export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Get user-friendly error messages
  const getAuthErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  };