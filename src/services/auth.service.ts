import { apiClient } from './api.config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  Admin,
  ContentManager,
} from './api.types';

export class AuthService {
  // Admin Authentication
  static async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/admin/login', credentials);
      
      if (response.data?.token) {
        apiClient.setAdminToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  }

  static async adminRegister(userData: RegisterRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/admin/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Admin registration failed');
    }
  }

  static async adminSetup(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/admin/setup');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Admin setup failed');
    }
  }

  // Content Manager Authentication
  static async contentManagerLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/content-manager/login', credentials);
      
      if (response.data?.token) {
        apiClient.setContentToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Content manager login failed');
    }
  }

  static async contentManagerRegister(userData: RegisterRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content-manager/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Content manager registration failed');
    }
  }

  // Token Management
  static logout() {
    apiClient.clearTokens();
  }

  static isAdminAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  static isContentManagerAuthenticated(): boolean {
    return !!localStorage.getItem('content_token');
  }

  static getCurrentAdminToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  static getCurrentContentToken(): string | null {
    return localStorage.getItem('content_token');
  }

  // User Info (would need additional endpoints)
  static async getCurrentAdmin(): Promise<Admin | null> {
    try {
      // This endpoint would need to be implemented on the backend
      const response = await apiClient.get<Admin>('/admin/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current admin:', error);
      return null;
    }
  }

  static async getCurrentContentManager(): Promise<ContentManager | null> {
    try {
      // This endpoint would need to be implemented on the backend
      const response = await apiClient.get<ContentManager>('/content-manager/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current content manager:', error);
      return null;
    }
  }
}

// Export individual methods for easier importing
export const {
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
} = AuthService;