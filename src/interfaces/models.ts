export interface User {
  ID: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  profilePic?: string | null;
  role: 'user' | 'admin';
  admin: boolean;
  enabled: boolean;
  banned: boolean;
}

export interface Session extends User {
  token: string;
}

export interface Author {
  ID: number;
  name: string;
}

export interface Category {
  ID: number;
  category: string;
  soldCopies: number;
}

export interface Review {
  ID: number;
  title: string;
  review: string;
  rating: number;
  createdAt: string;
  bookID: number;
  userID: number;
  user: Pick<User, 'ID' | 'username' | 'profilePic'>;
  reports: number[];
}

export interface Book {
  ID: number;
  title: string;
  description: string;
  price: string;
  image: string;
  authors: string[];
  categories: string[];
  publisher: string;
  publishedDate: string;
  pageCount: number;
  rating: number;
  language: string;
  avgReadingTime: number;
  soldCopies: number;
  reviews?: Review[];
  user_bookcart?: { createdAt: string };
  user_bookfav?: { createdAt: string };
}

export interface Order {
  ID: number;
  mpID: string;
  preferenceId?: string;
  items: Array<{
    ID: number;
    title: string;
    quantity: number;
    price: string;
    picture_url: string;
  }>;
  total: string;
  gift: boolean;
  giftrecipient?: string;
  status: string;
  createdAt: string;
}

export interface BookInput {
  title: string;
  description: string;
  price: string;
  image: string;
  authors: Array<{ value: string }>;
  categories: Array<{ value: string }>;
  publisher: string;
  publishedDate: string;
  pageCount: number;
  language: string;
}

export interface AdminStats {
  books: Array<{ ID: number; title: string; image: string; soldCopies: number }>;
  categories: Array<{ ID: number; category: string; soldCopies: number }>;
  users: { totalUsers: number; createdDate: Array<{ createdAt: string }> };
  payments: Array<{ items: number; createdAt: string; total: string }>;
}
