// Main export file for all services
// Re-export all service functions for easy importing

// Unified API Service (primary interface)
export { unifiedApiService, unifiedApiService as api } from './unified-api.service';

// Legacy services (for backwards compatibility) - explicit exports to avoid conflicts
export {apiClient} from './api.config';
export type * from './api.types';

// Legacy auth service functions
export { 
  adminLogin,
  contentManagerLogin,
  logout,
  adminRegister,
  contentManagerRegister
} from './auth.service';

// Legacy admin service functions
export {
  getAdmins,
  getContentManagers,
  addAdmin,
  addContentManager,
  deleteAdmin,
  deleteContentManager
} from './admin.service';

// Content service functions
export * from './content.service';

// Public service functions
export * from './public.service';