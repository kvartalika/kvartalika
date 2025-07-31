// Main export file for all services
// Re-export all service functions for easy importing

// API Configuration
export { apiClient } from './api.config';

// Type exports
export type * from './api.types';

// Auth Service exports
export {
  adminLogin,
  adminRegister,
  contentManagerLogin,
  logout,
  isAdminAuthenticated,
  isContentManagerAuthenticated,
  getStoredAdminToken,
  getStoredContentToken
} from './auth.service';

// Admin Service exports
export {
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
  getDashboardStats,
  getSystemLogs
} from './admin.service';

// Content Service exports
export {
  // Categories
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Homes
  createHome,
  updateHome,
  deleteHome,
  
  // Flats
  createFlat,
  updateFlat,
  deleteFlat,
  
  // Photos
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  bulkUploadPhotos,
  bulkDeletePhotos
} from './content.service';

// Public Service exports
export {
  getCategories,
  getHomes,
  getFlats,
  getHomeById,
  getFlatById,
  searchHomes,
  createRequest,
  getFeaturedHomes,
  getPopularFlats,
  getFooter,
  getFilterOptions
} from './public.service';

// Legacy API Service for backward compatibility
export { ApiService } from './apiService';