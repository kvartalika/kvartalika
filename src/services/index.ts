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
  AuthService,
  AdminService,
  ContentService,
  PublicService,
} from './auth.service';

export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Admin,
  ContentManager,
} from './api.types';

export type {
  Flat,
  Home,
  Category,
  Description,
  Photo,
  Footer,
  PaginationParams,
} from './api.types';

export type {
  SearchRequest,
  PaginatedResponse,
} from './api.types';