// Unified Types for the entire application
// This file consolidates all type definitions to prevent conflicts

// User and Authentication Types
export type UserRole = 'CLIENT' | 'ADMIN' | 'CONTENT_MANAGER' | 'CM';

export interface AuthUser {
  id?: number;
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  telegramId?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: UserRole | null;
}

// Apartment and Complex Types
export interface Apartment {
  id: number;
  complex: string;
  complexId: number;
  address: string;
  rooms: number;
  floor: number;
  bathroom: string;
  bathrooms: number;
  finishing: string;
  isHot: boolean;
  image: string;
  price: number;
  area: number;
  description?: string;
  images?: string[];
  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;
  distanceFromCenter?: number;
  layout?: string;
  // Additional properties from content.store
  name?: string;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  latitude?: number;
  longitude?: number;
  features?: string[];
  about?: string;
  homeId?: number;
  hasDecoration?: boolean;
  published?: boolean;
}

export interface Complex {
  id: number;
  name: string;
  address: string;
  description: string;
  image: string;
  images?: string[];
  apartments: Apartment[];
  amenities?: string[];
  features?: string[];
  constructionHistory?: {
    startDate: string;
    endDate: string;
    phases: { name: string; date: string; description: string }[];
  };
  // Additional properties
  yearBuilt?: number;
  numberOfFloors?: number;
  latitude?: number;
  longitude?: number;
  history?: string[];
  historyImages?: string[];
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number[];
  bathrooms?: number[];
  finishing?: string[];
  category?: string;
  complex?: string;
  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;
  sortBy?: 'price' | 'rooms' | 'area' | 'location';
  sortOrder?: 'asc' | 'desc';
}

// Booking Types
export interface BookingForm {
  name: string;
  phone: string;
  email: string;
  apartmentId?: number;
  complexId?: number;
}

// Homepage Section Types
export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  type: 'hot_deals' | 'rooms' | 'custom';
  isVisible: boolean;
  order: number;
  rooms?: number;
  customFilter?: (apartments: Apartment[]) => Apartment[];
  backgroundColor?: 'white' | 'gray';
  linkText?: string;
  linkUrl?: string;
}

// API Request Types
export interface LoginRequest {
  username?: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  password: string;
  telegramId: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  role: UserRole;
}

// Content Management Types
export interface Category {
  id: number;
  name: string;
  isOnMainPage: boolean;
}

export interface Photo {
  id: number;
  url: string;
  name?: string;
}

export interface Flat {
  id: number;
  name: string;
  description: string;
  images: string[];
  layout?: string;
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
  numberOfBathrooms: number;
  hasDecoration: boolean;
  published: boolean;
  photos?: Photo[];
  categoryId?: number;
  totalFloors?: number;
  rooms?: number;
  title?: string;
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
  photos?: Photo[];
  categoryId?: number;
  amenities?: string[];
}

// API Request Interfaces
export interface FlatRequest {
  id?: number;
  name?: string;
  description?: string;
  images?: string[];
  layout?: string;
  address?: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  features?: string[];
  numberOfRooms?: number;
  area?: number;
  about?: string;
  floor?: number;
  homeId?: number;
  numberOfBathrooms?: number;
  hasDecoration?: boolean;
  published?: boolean;
  photos?: number[];
  categoryId?: number;
  totalFloors?: number;
  rooms?: number;
  title?: string;
}

export interface HomeRequest {
  id?: number;
  name?: string;
  description?: string;
  images?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  yearBuilt?: number;
  history?: string[];
  historyImages?: string[];
  features?: string[];
  about?: string;
  numberOfFloors?: number;
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
  photos?: number[];
  categoryId?: number;
  amenities?: string[];
}

// Form Data Types
export interface UnifiedFormData {
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  floor?: number;
  price?: number;
  area?: number;
  yearBuilt?: number;
  numberOfFloors?: number;
  images?: string[];
  features?: string[];
  hasDecoration?: boolean;
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
  about?: string;
  [key: string]: any; // Index signature for dynamic access
}

// File Management Types
export interface FileItem {
  id: number;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  path: string;
}

export interface Directory {
  id: number;
  name: string;
  path: string;
}

// Footer Types
export interface Footer {
  id: number;
  content: string;
}

// Main Page Content Types
export interface MainPageContent {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  servicesTitle: string;
  servicesDescription: string;
}

// User DTO for API responses
export interface UserDto {
  id?: number;
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  role: string;
  password?: string;
  telegramId?: string;
}