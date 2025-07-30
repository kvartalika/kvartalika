// API Configuration
export { apiClient, type ApiConfig, type AuthTokens } from './api.config';

// Types
export * from './api.types';

// Services
export { AuthService } from './auth.service';
export { AdminService } from './admin.service';
export { ContentService } from './content.service';
export { PublicService } from './public.service';

// Individual exports for easier importing
export {
  // Auth exports
  adminLogin,
  adminRegister,
  adminSetup,
  contentManagerLogin,
  contentManagerRegister,
  logout,
  isAdminAuthenticated,
  isContentManagerAuthenticated,
  getCurrentAdminToken,
  getCurrentContentToken,
  getCurrentAdmin,
  getCurrentContentManager,
} from './auth.service';

export {
  // Admin exports
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
  getDashboardStats,
  getSystemLogs,
  getAuditTrail,
  getSystemConfig,
  updateSystemConfig,
  getAllUsers,
  banUser,
  unbanUser,
  createBackup,
  getBackups,
  restoreBackup,
} from './admin.service';

export {
  // Content exports
  createCategory,
  updateCategory,
  deleteCategory,
  createDescription,
  updateDescription,
  deleteDescription,
  createFlat,
  updateFlat,
  deleteFlat,
  createHome,
  updateHome,
  deleteHome,
  createFooter,
  updateFooter,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  bulkUploadPhotos,
  bulkDeletePhotos,
  getContentTemplates,
  createContentTemplate,
} from './content.service';

export {
  // Public exports
  getCategories,
  getCategoryById,
  getDescriptions,
  getDescriptionById,
  getFlats,
  getFlatById,
  getFlatsByHome,
  getHomes,
  getHomeById,
  getHomesByCategory,
  getPhotos,
  getPhotoById,
  getFooter,
  searchHomes,
  advancedSearch,
  createRequest,
  getPublicStats,
  getFeaturedHomes,
  getPopularFlats,
  getFilterOptions,
  getNearbyAmenities,
  getMapData,
} from './public.service';

// Legacy API Service (updated to use new services)
export { ApiService } from './apiService';

// API Client instance
export default apiClient;