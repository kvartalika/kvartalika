// API Request Types
import type {UserRole} from "../store/auth.store.ts";

export interface LoginRequest {
  username?: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  password: string;
  telegramId: string;
}

export interface RegisterResponse {
  message: string;
  id: string;
}

export interface ContentManagerRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
}

export interface DescriptionRequest {
  title: string;
  content: string;
  type?: string;
}

export interface FlatRequest {
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  floor: number;
  totalFloors?: number;
  homeId: number;
  categoryId?: number;
  photos?: number[];
}

export interface HomeRequest {
  name: string;
  description: string;
  address: string;
  categoryId?: number;
  photos?: number[];
  amenities?: string[];
}

export interface FooterRequest {
  content: string;
  links?: Array<{
    title: string;
    url: string;
  }>;
  contacts?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export interface RequestCreate {
  name?: string;
  surname?: string;
  patronymic?: string;
  phone?: string;
  email?: string;
}

export interface SearchRequest {
  query?: string;

  minPrice?: number;
  maxPrice?: number;

  rooms?: number;

  bathrooms?: number;
  isDecorated?: boolean;

  homeId?: number;

  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;

  categoriesId?: number[];

  sortBy?: 'price' | 'rooms' | 'area' | 'location';
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  status?: number;
}

export interface RequestsPost201Response {
  id: number;
  message: string;
  success: boolean;
}

export interface Category {
  id: number;
  name: string;
  isOnMainPage: boolean;
}

export interface Description {
  id: number;
  title: string;
  content: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: number;
  url: string;
  altText?: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flat {
  id: number;
  name: string;
  description: string;
  images: string[];
  layout: string;
  address: string;
  price: number;
  latitude: number;
  longitude: number;
  features: string[];
  numberOfRooms: number;
  area: number;
  about: string;
  floor: number;
  homeId: number;
  numberOfBathrooms: number
  hasDecoration: boolean;
  numberForSale: number
  published: boolean;
}

export interface FlatWithCategory extends Flat {
  categories: Category[];
}

export interface HomePageFlats {
  category: Category;
  flats: FlatWithCategory[];
}

export interface Home {
  id: number;
  name: string;
  description: string;
  images: string[];
  address: string;
  latitude: number;
  longitude: number;
  yearBuilt: number;
  history: string[];
  historyImages: string[];
  features: string[];
  about: string;
  numberOfFloors: number;
  storesNearby: boolean;
  schoolsNearby: boolean;
  hospitalsNearby: boolean;
  hasYards: boolean;
  yardsImages: string[];
  published: boolean;
}

export interface Footer {
  id: number;
  content: string;
  links?: Array<{
    title: string;
    url: string;
  }>;
  contacts?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContentManager {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FileUploadRequest {
  file: File;
  altText?: string;
}

export interface FileUploadResponse {
  id: number;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}