// Main export file for all services
// Re-export all service functions for easy importing

// Unified API Service (primary interface)
export * from './unified-api.service';

// Legacy services (for backwards compatibility)
export {apiClient} from './api.config';
export type * from './api.types';
export * from './auth.service';
export * from './admin.service';
export * from './content.service';
export * from './public.service';
export {ApiService} from './apiService';

// Convenience re-exports
export { unifiedApiService as api } from './unified-api.service';