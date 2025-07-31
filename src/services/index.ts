// Services exports
export * from './api.config';
export * from './api.types';
export * from './apiService';
export * from './auth.service';
export * from './content.service';
export * from './public.service';
export * from './admin.service';
export * from './contentApi';

// Re-export types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  FileUploadResponse,
  RequestCreate,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Admin,
  ContentManager,
  Flat,
  Home,
  Category,
  Description,
  Footer,
  Photo,
  SearchRequest,
  PaginationParams,
} from './api.types';