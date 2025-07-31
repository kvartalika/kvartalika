// API Request Types
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
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
  name: string;
  phone: string;
  email?: string;
  message?: string;
  flatId?: number;
  homeId?: number;
}

export interface SearchRequest {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number[];
  categoryId?: number;
  homeId?: number;
  minArea?: number;
  maxArea?: number;
  minFloor?: number;
  maxFloor?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface RequestsPost201Response {
  id: number;
  message: string;
  success: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
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
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  floor: number;
  totalFloors?: number;
  homeId: number;
  home?: Home;
  categoryId?: number;
  category?: Category;
  photos?: Photo[];
  createdAt: string;
  updatedAt: string;
}

export interface Home {
  id: number;
  name: string;
  description: string;
  address: string;
  categoryId?: number;
  category?: Category;
  photos?: Photo[];
  flats?: Flat[];
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
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
  token: string;
  user: Admin | ContentManager;
  expiresIn: number;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Pagination types
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

// File upload types
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