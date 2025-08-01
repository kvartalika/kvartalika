import {apiClient} from './api.config';
import type {ApiResponse, PaginationParams, UserDto,} from './api.types';
import {AxiosError} from 'axios';

export class AdminService {
  static async getContentManagers(params?: PaginationParams): Promise<UserDto[]> {
    try {
      const response = await apiClient.get<UserDto[]>('/admin/content-managers', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get content managers');
      }
      throw error;
    }
  }

  static async addContentManager(managerData: UserDto): Promise<ApiResponse<UserDto>> {
    try {
      const response = await apiClient.post<ApiResponse<UserDto>, UserDto>('/admin/content-managers', managerData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to add content manager');
      }
      throw error;
    }
  }

  static async updateContentManager(email: string, managerData: Partial<UserDto>): Promise<ApiResponse<UserDto>> {
    try {
      const response = await apiClient.put<ApiResponse<UserDto>, Partial<UserDto>>(`/admin/content-managers/${email}`, managerData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update content manager');
      }
      throw error;
    }
  }

  static async deleteContentManager(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/admin/content-managers/${email}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete content manager');
      }
      throw error;
    }
  }

  static async getAdmins(params?: PaginationParams): Promise<UserDto[]> {
    try {
      const response = await apiClient.get<UserDto[]>('/admin/admin', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get admins');
      }
      throw error;
    }
  }

  static async addAdmin(adminData: UserDto): Promise<ApiResponse<UserDto>> {
    try {
      const response = await apiClient.post<ApiResponse<UserDto>, UserDto>('/admin/admin', adminData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create admin');
      }
      throw error;
    }
  }

  static async updateAdmin(email: string, adminData: Partial<UserDto>): Promise<ApiResponse<UserDto>> {
    try {
      const response = await apiClient.put<ApiResponse<UserDto>, Partial<UserDto>>(`/admin/admin/${email}`, adminData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update admin');
      }
      throw error;
    }
  }

  static async deleteAdmin(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/admin/admin/${email}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete admin');
      }
      throw error;
    }
  }
}

export const {
  getContentManagers,
  addContentManager,
  deleteAdmin,
  getAdmins,
  addAdmin,
  updateAdmin,
  updateContentManager,
  deleteContentManager,
} = AdminService;