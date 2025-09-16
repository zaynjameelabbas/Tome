// Firebase Firestore database service
// Handles all database operations for user books, reading progress, and challenges

import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    Timestamp
  } from 'firebase/firestore';
  import { User } from 'firebase/auth';
  import { db } from './firebase';
  import { Book } from '../types';
  
  export type ReadingStatus = 'want-to-read' | 'reading' | 'read';
  
  // Database collections
  const COLLECTIONS = {
    USERS: 'users',
    USER_BOOKS: 'userBooks',
    READING_PROGRESS: 'readingProgress',
    READING_CHALLENGES: 'readingChallenges'
  } as const;
  
  // User profile interface
  export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
    createdAt: Date;
    readingGoal?: number;
    booksRead?: number;
  }
  
  // User book interface (book + user-specific data)
  export interface UserBook {
    id: string;
    userId: string;
    book: Book;
    status: ReadingStatus;
    dateAdded: Date;
    dateStarted?: Date;
    dateFinished?: Date;
    currentPage?: number;
    totalPages?: number;
    rating?: number;
    notes?: string;
    progress?: number; // percentage
  }
  
  // Reading session interface
  export interface ReadingProgress {
    id: string;
    userId: string;
    bookId: string;
    currentPage: number;
    totalPages: number;
    lastUpdated: Date;
    sessionsRead: number;
    totalTimeMinutes: number;
  }
  
  // Reading challenge interface
  export interface ReadingChallenge {
    id: string;
    userId: string;
    year: number;
    targetBooks: number;
    currentBooks: number;
    createdAt: Date;
    completedAt?: Date;
  }
  
  // === USER MANAGEMENT ===
  
  // Create or update user profile
    export const createUserProfile = async (user: User): Promise<void> => {
        try {
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || null,  // Change undefined to null
            photoURL: user.photoURL || null,        // Change undefined to null
            createdAt: new Date(),
            readingGoal: 12,
            booksRead: 0
            };
            
            await setDoc(userRef, {
            ...userProfile,
            createdAt: serverTimestamp()
            });
        }
        } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
        }
    };
  
  // Get user profile
  export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };
  
  // === BOOK MANAGEMENT ===
  
  // Add book to user's library
  export const addBookToLibrary = async (
    userId: string, 
    book: Book, 
    status: ReadingStatus
  ): Promise<void> => {
    try {
      // Remove from other status lists first
      await removeBookFromLibrary(userId, book.id);
      
      const userBookRef = doc(db, COLLECTIONS.USER_BOOKS, `${userId}_${book.id}`);
      const userBook: UserBook = {
        id: `${userId}_${book.id}`,
        userId,
        book,
        status,
        dateAdded: new Date(),
        ...(status === 'reading' && { dateStarted: new Date() }),
        ...(status === 'read' && { dateFinished: new Date() }),
        currentPage: 0,
        totalPages: book.pageCount || undefined,
        progress: 0
      };
      
      await setDoc(userBookRef, {
        ...userBook,
        dateAdded: serverTimestamp(),
        ...(userBook.dateStarted && { dateStarted: serverTimestamp() }),
        ...(userBook.dateFinished && { dateFinished: serverTimestamp() })
      });
      
      // Update user's books read count if marking as read
      if (status === 'read') {
        await updateBooksReadCount(userId, 1);
      }
    } catch (error) {
      console.error('Error adding book to library:', error);
      throw error;
    }
  };
  
  // Get user's books by status
  export const getUserBooksByStatus = async (
    userId: string, 
    status: ReadingStatus
  ): Promise<UserBook[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USER_BOOKS),
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('dateAdded', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const userBooks: UserBook[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userBooks.push({
          ...data,
          dateAdded: data.dateAdded?.toDate() || new Date(),
          dateStarted: data.dateStarted?.toDate(),
          dateFinished: data.dateFinished?.toDate()
        } as UserBook);
      });
      
      return userBooks;
    } catch (error) {
      console.error(`Error getting ${status} books:`, error);
      return [];
    }
  };
  
  // Update book status
  export const updateBookStatus = async (
    userId: string,
    bookId: string,
    newStatus: ReadingStatus
  ): Promise<void> => {
    try {
      const userBookRef = doc(db, COLLECTIONS.USER_BOOKS, `${userId}_${bookId}`);
      const updateData: any = {
        status: newStatus
      };
      
      // Add timestamps based on status
      if (newStatus === 'reading' && !updateData.dateStarted) {
        updateData.dateStarted = serverTimestamp();
      } else if (newStatus === 'read') {
        updateData.dateFinished = serverTimestamp();
        updateData.progress = 100;
        // Update user's books read count
        await updateBooksReadCount(userId, 1);
      }
      
      await updateDoc(userBookRef, updateData);
    } catch (error) {
      console.error('Error updating book status:', error);
      throw error;
    }
  };
  
  // Remove book from library
  export const removeBookFromLibrary = async (userId: string, bookId: string): Promise<void> => {
    try {
      const userBookRef = doc(db, COLLECTIONS.USER_BOOKS, `${userId}_${bookId}`);
      await deleteDoc(userBookRef);
    } catch (error) {
      console.error('Error removing book from library:', error);
    }
  };
  
  // Get current status of a book
  export const getBookStatus = async (
    userId: string, 
    bookId: string
  ): Promise<ReadingStatus | null> => {
    try {
      const userBookRef = doc(db, COLLECTIONS.USER_BOOKS, `${userId}_${bookId}`);
      const userBookDoc = await getDoc(userBookRef);
      
      if (userBookDoc.exists()) {
        return userBookDoc.data().status as ReadingStatus;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting book status:', error);
      return null;
    }
  };
  
  // === READING PROGRESS ===
  
  // Update reading progress
  export const updateReadingProgress = async (
    userId: string,
    bookId: string,
    currentPage: number,
    totalPages: number,
    sessionMinutes: number = 0
  ): Promise<void> => {
    try {
      const userBookRef = doc(db, COLLECTIONS.USER_BOOKS, `${userId}_${bookId}`);
      const progress = Math.round((currentPage / totalPages) * 100);
      
      await updateDoc(userBookRef, {
        currentPage,
        progress,
        totalPages
      });
      
      // If book is completed, update status
      if (progress >= 100) {
        await updateBookStatus(userId, bookId, 'read');
      }
    } catch (error) {
      console.error('Error updating reading progress:', error);
      throw error;
    }
  };
  
  // === READING CHALLENGES ===
  
  // Create reading challenge
  export const createReadingChallenge = async (
    userId: string,
    year: number,
    targetBooks: number
  ): Promise<void> => {
    try {
      const challengeRef = doc(db, COLLECTIONS.READING_CHALLENGES, `${userId}_${year}`);
      const challenge: ReadingChallenge = {
        id: `${userId}_${year}`,
        userId,
        year,
        targetBooks,
        currentBooks: 0,
        createdAt: new Date()
      };
      
      await setDoc(challengeRef, {
        ...challenge,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating reading challenge:', error);
      throw error;
    }
  };
  
  // Get user's reading challenge for a year
  export const getReadingChallenge = async (
    userId: string,
    year: number
  ): Promise<ReadingChallenge | null> => {
    try {
      const challengeRef = doc(db, COLLECTIONS.READING_CHALLENGES, `${userId}_${year}`);
      const challengeDoc = await getDoc(challengeRef);
      
      if (challengeDoc.exists()) {
        const data = challengeDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate()
        } as ReadingChallenge;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting reading challenge:', error);
      return null;
    }
  };
  
  // === UTILITY FUNCTIONS ===
  
  // Update user's books read count
  const updateBooksReadCount = async (userId: string, increment: number): Promise<void> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentCount = userDoc.data().booksRead || 0;
        await updateDoc(userRef, {
          booksRead: currentCount + increment
        });
        
        // Update current year's reading challenge
        const currentYear = new Date().getFullYear();
        const challengeRef = doc(db, COLLECTIONS.READING_CHALLENGES, `${userId}_${currentYear}`);
        const challengeDoc = await getDoc(challengeRef);
        
        if (challengeDoc.exists()) {
          const currentBooks = challengeDoc.data().currentBooks || 0;
          await updateDoc(challengeRef, {
            currentBooks: currentBooks + increment
          });
        }
      }
    } catch (error) {
      console.error('Error updating books read count:', error);
    }
  };
  
  // Get library statistics
  export const getLibraryStats = async (userId: string) => {
    try {
      const [wantToRead, reading, read] = await Promise.all([
        getUserBooksByStatus(userId, 'want-to-read'),
        getUserBooksByStatus(userId, 'reading'),
        getUserBooksByStatus(userId, 'read')
      ]);
      
      return {
        wantToRead: wantToRead.length,
        reading: reading.length,
        read: read.length,
        total: wantToRead.length + reading.length + read.length
      };
    } catch (error) {
      console.error('Error getting library stats:', error);
      return { wantToRead: 0, reading: 0, read: 0, total: 0 };
    }
  };