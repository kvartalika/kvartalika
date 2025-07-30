import { apiClient } from './api.config';
import type {
  ContentManagerRequest,
  ContentManager,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from './api.types';

export class AdminService {
  // Content Manager Management
  static async getContentManagers(params?: PaginationParams): Promise<ContentManager[]> {
    try {
      const response = await apiClient.get<ContentManager[]>('/admin/content-managers', {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get content managers');
    }
  }

  static async createContentManager(managerData: ContentManagerRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/admin/content-managers', managerData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Content manager already exists');
      }
      throw new Error(error.response?.data?.message || 'Failed to create content manager');
    }
  }

  static async updateContentManager(
    id: string,
    managerData: Partial<ContentManagerRequest>
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(
        `/admin/content-managers?id=${id}`,
        managerData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Content manager not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update content manager');
    }
  }

  static async deleteContentManager(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/admin/content-managers?id=${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Content manager not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete content manager');
    }
  }

  // Admin Analytics and Reports (would need additional endpoints)
  static async getDashboardStats(): Promise<any> {
    try {
      // This would be a custom endpoint for admin dashboard
      const response = await apiClient.get<any>('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get dashboard stats');
    }
  }

  static async getSystemLogs(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    try {
      // This would be a custom endpoint for system logs
      const response = await apiClient.get<PaginatedResponse<any>>('/admin/logs', {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get system logs');
    }
  }

  static async getAuditTrail(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    try {
      // This would be a custom endpoint for audit trail
      const response = await apiClient.get<PaginatedResponse<any>>('/admin/audit', {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get audit trail');
    }
  }

  // System Configuration
  static async getSystemConfig(): Promise<any> {
    try {
      const response = await apiClient.get<any>('/admin/config');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get system config');
    }
  }

  static async updateSystemConfig(config: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>('/admin/config', config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update system config');
    }
  }

  // User Management (additional admin functions)
  static async getAllUsers(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    try {
      const response = await apiClient.get<PaginatedResponse<any>>('/admin/users', {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  }

  static async banUser(userId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(`/admin/users/${userId}/ban`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to ban user');
    }
  }

  static async unbanUser(userId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(`/admin/users/${userId}/unban`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unban user');
    }
  }

  // Backup and Maintenance
  static async createBackup(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/admin/backup');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create backup');
    }
  }

  static async getBackups(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('/admin/backups');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get backups');
    }
  }

  static async restoreBackup(backupId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(`/admin/backup/${backupId}/restore`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to restore backup');
    }
  }
}

// Export individual methods for easier importing
export const {
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
} = AdminService;