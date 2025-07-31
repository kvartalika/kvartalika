// Export all services
export * from './auth.service';
export * from './admin.service';
export * from './content.service';
export * from './public.service';
export * from './contentApi';

// Export API configuration
export * from './api.config';
export * from './api.types';
export * from './apiService';

// Re-export types for convenience
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Admin,
  ContentManager,
  Flat,
  Home,
  Category,
  Description,
  Photo,
  Footer,
  PaginationParams,
  SearchRequest,
  PaginatedResponse,
} from './api.types';