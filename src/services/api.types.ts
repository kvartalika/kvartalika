// API Request Types
import type {UserRole} from "../store";
import type {TABS} from "./index.ts";

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

export interface RegisterResponse {
  message: string;
  id: string;
}

export interface ContentManagerRequest {
  name?: string;
  surname?: string;
  patronymic?: string;
  email?: string;
  phone?: string;
  password?: string;
  telegramId?: string;
  role?: UserRole;
}

export interface UserDto {
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  role: UserRole;
  password: string;
  telegramId?: string;
}

export interface CategoryRequest {
  id?: number;
  name?: string;
  isOnMainPage?: boolean;
}

export const defaultCategory = {
  name: '',
  isOnMainPage: false,
}

export interface DescriptionRequest {
  title: string;
  content: string;
  type?: string;
}

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
  numberOfBathrooms?: number
  hasDecoration?: boolean;
  numberForSale?: number
  published?: boolean;
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
  yardsImages?: string[];
  model3D?: string;
  published?: boolean;
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
  name?: string;
  isOnMainPage?: boolean;
}

export interface BidRequest {
  name?: string;
  surname?: string;
  patronymic?: string;
  phone?: string;
  email?: string;
  isChecked: boolean;
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

export interface FlatWithCategory {
  flat: Flat;
  categories: Category[];
}

export interface FlatWithCategoryRequest {
  flat: FlatRequest;
  categories: Partial<Category>[];
}

export interface ResolvedFlat extends FlatWithCategoryRequest {
  imagesResolved?: string[];
  layoutResolved?: string;
}

export interface HomePageFlats {
  category: Category;
  flats: ResolvedFlat[];
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

export interface ResolvedHome extends HomeRequest {
  imagesResolved?: string[];
  historyImagesResolved?: string[];
  yardsImagesResolved?: string[];
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

export interface SocialMedia {
  id: number;
  image: string;
  link: string;
}

export type Tab = (typeof TABS)[number];