// Google Books API service
// Handles all interactions with Google Books API

import { Book } from '../types';

// Replace with your actual Google Books API key
const GOOGLE_BOOKS_API_KEY = 'AIzaSyCsFHelKOtwSo2tAE2a_8MPv3sRxtO8i3U';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Google Books API response types
interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    pageCount?: number;
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    averageRating?: number;
    ratingsCount?: number;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

interface GoogleBooksResponse {
  items?: GoogleBookItem[];
  totalItems: number;
}

// Convert Google Books item to our Book type
const convertToBook = (item: GoogleBookItem): Book => {
  const volumeInfo = item.volumeInfo;
  
  return {
    id: item.id,
    title: volumeInfo.title || 'Unknown Title',
    author: volumeInfo.authors?.join(', ') || 'Unknown Author',
    isbn: volumeInfo.industryIdentifiers?.find(id => 
      id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier,
    coverUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
              volumeInfo.imageLinks?.small?.replace('http:', 'https:'),
    summary: volumeInfo.description,
    categories: volumeInfo.categories || [],
    pageCount: volumeInfo.pageCount,
    publishedDate: volumeInfo.publishedDate,
    rating: volumeInfo.averageRating,
    dateAdded: new Date(),
  };
};

// Search books by query (title, author, etc.)
export const searchBooks = async (
  query: string, 
  maxResults: number = 20
): Promise<Book[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}?q=${encodedQuery}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }
    
    const data: GoogleBooksResponse = await response.json();
    
    return data.items?.map(convertToBook) || [];
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// Get book by ID
export const getBookById = async (bookId: string): Promise<Book | null> => {
  try {
    const url = `${BASE_URL}/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }
    
    const data: GoogleBookItem = await response.json();
    
    return convertToBook(data);
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};

// Search by ISBN
export const searchBooksByISBN = async (isbn: string): Promise<Book[]> => {
  return searchBooks(`isbn:${isbn}`);
};

// Search by author
export const searchBooksByAuthor = async (author: string): Promise<Book[]> => {
  return searchBooks(`inauthor:${author}`);
};

// Search by category/subject
export const searchBooksByCategory = async (category: string): Promise<Book[]> => {
  return searchBooks(`subject:${category}`);
};

// Get popular/trending books (using a curated search)
export const getPopularBooks = async (): Promise<Book[]> => {
  // Google Books doesn't have a "trending" endpoint, so we'll search for popular titles
  const popularQueries = [
    'bestseller fiction',
    'popular nonfiction',
    'award winning books'
  ];
  
  try {
    const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
    return await searchBooks(randomQuery, 10);
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return [];
  }
};

// Get recommendations based on a book (find similar books)
export const getRecommendations = async (book: Book): Promise<Book[]> => {
  try {
    // Search for books by same author or in same category
    const authorQuery = book.author ? `inauthor:"${book.author}"` : '';
    const categoryQuery = book.categories.length > 0 ? 
      `subject:"${book.categories[0]}"` : '';
    
    const query = authorQuery || categoryQuery || book.title;
    const results = await searchBooks(query, 8);
    
    // Filter out the original book
    return results.filter(result => result.id !== book.id);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};