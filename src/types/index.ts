export interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    coverUrl?: string;          // Now will have real cover URLs
    summary?: string;           // Full description from Google Books
    categories: string[];
    pageCount?: number;
    publishedDate?: string;
    rating?: number;           // Average rating from Google Books
    ratingsCount?: number;     // Number of ratings (new field)
    dateAdded: Date;
    dateStarted?: Date;
    dateFinished?: Date;
    currentPage?: number;
    notes?: string;
    aiGenerated?: {
      summary?: string;
      categories?: string[];
      keyThemes?: string[];
    };
  }
  
  export interface ReadingProgress {
    bookId: string;
    currentPage: number;
    totalPages: number;
    percentage: number;
    lastUpdated: Date;
  }
  
  export interface BookCategory {
    id: string;
    name: string;
    color: string;
    bookCount: number;
  }
  
  // Navigation types
  export type RootStackParamList = {
    MainTabs: undefined;
    BookDetails: { bookId: string };
  };
  
  export type MainTabParamList = {
    Library: undefined;
    Scan: undefined;
    Search: undefined;
  };