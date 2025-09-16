export interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    coverUrl?: string;
    summary?: string;
    categories: string[];
    pageCount?: number;
    publishedDate?: string;
    rating?: number; //1-5 stars
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