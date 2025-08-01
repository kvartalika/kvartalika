import { DefaultApi, Configuration } from '../api';
import type { UserDto } from '../types';
import type { 
  LoginRequest, 
  ContentManagerRequest,
  SearchRequest,
  Flat,
  Home,
  RegisterRequest
} from '../api/api';

// Configure the API client
const apiConfiguration = new Configuration({
  basePath: process.env.REACT_APP_API_BASE_URL || '/api',
});

const apiClient = new DefaultApi(apiConfiguration);

// Helper to get auth token from storage
const getAuthToken = (): string | null => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      return parsed.state.accessToken || null;
    } catch {
      return null;
    }
  }
  return null;
};

// Helper to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Auth response interface
interface AuthResponse {
  accessToken: string;
  role: string;
  user?: UserDto;
}

export class NewApiService {
  // Admin Authentication
  static async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Admin login failed');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Admin login failed');
    }
  }

  static async adminRegister(userData: RegisterRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Admin registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Admin registration failed');
    }
  }

  // Content Manager Authentication  
  static async contentManagerLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.contentManagerLoginPost(credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Content manager login failed');
    }
  }

  static async contentManagerRegister(userData: RegisterRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/content-manager/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Content manager registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Content manager registration failed');
    }
  }

  // Auth Refresh
  static async refreshAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Auth refresh failed');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Auth refresh failed');
    }
  }

  // Admin Management - GET, POST /admin/admin
  static async getAdmins(): Promise<UserDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch admins');
    }
  }

  static async createAdmin(userData: UserDto): Promise<UserDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create admin');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create admin');
    }
  }

  // Admin Management - PUT/DELETE by email
  static async updateAdmin(email: string, userData: Partial<UserDto>): Promise<UserDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update admin');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update admin');
    }
  }

  static async deleteAdmin(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete admin');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete admin');
    }
  }

  // Content Manager Management - GET, POST /admin/content-managers
  static async getContentManagers(): Promise<UserDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/content-managers`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch content managers');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch content managers');
    }
  }

  static async createContentManager(userData: UserDto): Promise<UserDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/content-managers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create content manager');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create content manager');
    }
  }

  // Content Manager Management - PUT/DELETE by email
  static async updateContentManager(email: string, userData: Partial<UserDto>): Promise<UserDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/content-managers/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update content manager');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update content manager');
    }
  }

  static async deleteContentManager(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/content-managers/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete content manager');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete content manager');
    }
  }

  // Search Endpoint
  static async search(searchRequest: SearchRequest): Promise<Flat[]> {
    try {
      const response = await apiClient.searchPost(searchRequest);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  // Get All Apartments/Flats
  static async getFlats(): Promise<Flat[]> {
    try {
      const response = await apiClient.flatsGet();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch apartments');
    }
  }

  // Get All Homes/Complexes
  static async getHomes(): Promise<Home[]> {
    try {
      const response = await apiClient.homesGet();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch homes');
    }
  }
}

// Export individual methods for easier importing
export const {
  adminLogin,
  adminRegister,
  contentManagerLogin,
  contentManagerRegister,
  refreshAuth,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
  search,
  getFlats,
  getHomes,
} = NewApiService;