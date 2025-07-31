import {apiClient} from './api.config';
import type {
  ContentManagerRequest,
  ContentManager,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from './api.types';
import {AxiosError} from 'axios';

export class AdminService {
  static async getContentManagers(params?: PaginationParams): Promise<ContentManager[]> {
    return AdminService.safeRequest(() =>
        apiClient.get<ContentManager[]>('/admin/content-managers', {params}),
      'Failed to get content managers'
    );
  }

  static async createContentManager(managerData: ContentManagerRequest): Promise<ApiResponse<ContentManager>> {
    return AdminService.safeRequest(
      () => apiClient.post<ApiResponse<ContentManager>, ContentManagerRequest>('/admin/content-managers', managerData),
      'Content manager already exists',
      409
    );
  }

  static async updateContentManager(id: string, managerData: Partial<ContentManagerRequest>): Promise<ApiResponse<ContentManager>> {
    return AdminService.safeRequest(
      () => apiClient.put<ApiResponse<ContentManager>, Partial<ContentManagerRequest>>(`/admin/content-managers?id=${id}`, managerData),
      'Content manager not found',
      404
    );
  }

  static async deleteContentManager(id: string): Promise<ApiResponse<void>> {
    return AdminService.safeRequest(
      () => apiClient.delete<ApiResponse<void>>(`/admin/content-managers?id=${id}`),
      'Content manager not found',
      404
    );
  }

  static async getDashboardStats(): Promise<any> {
    return AdminService.safeRequest(() =>
        apiClient.get<any>('/admin/dashboard/stats'),
      'Failed to get dashboard stats'
    );
  }

  static async getAllUsers(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return AdminService.safeRequest(() =>
        apiClient.get<PaginatedResponse<any>>('/admin/users', {params}),
      'Failed to get users'
    );
  }

  private static async safeRequest<T>(
    fn: () => Promise<{ data: T }>,
    defaultMessage: string,
    specificStatus?: number
  ): Promise<T> {
    try {
      const response = await fn();
      return response.data;
    } catch (error) {
      AdminService.handleError(error, defaultMessage, specificStatus);
    }
  }

  private static handleError(error: unknown, defaultMessage: string, specificStatus?: number): never {
    if (error instanceof AxiosError) {
      if (specificStatus && error.response?.status === specificStatus) {
        throw new Error(defaultMessage);
      }
      throw new Error(error.response?.data?.message || defaultMessage);
    }
    throw error;
  }
}

export const {
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
  getDashboardStats,
  getAllUsers,
} = AdminService;