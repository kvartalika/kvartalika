import { apiClient } from './api.config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  UserDto,
  ContentManager,
  Admin,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  SearchRequest,
  Flat,
  Home,
  Category,
  Description,
  Photo,
  Footer,
  RequestCreate,
  RequestsPost201Response,
  FlatWithCategory,
} from './api.types';
import { AxiosError } from 'axios';

export class NewApiService {
  // Authentication endpoints
  static async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse, LoginRequest>('/admin/login', credentials);
      if (response.data?.accessToken) {
        apiClient.setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Admin login failed');
      }
      throw error;
    }
  }

  static async adminRegister(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse, RegisterRequest>('/admin/register', userData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Admin registration failed');
      }
      throw error;
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      if (response.data?.accessToken) {
        apiClient.setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Token refresh failed');
      }
      throw error;
    }
  }

  static async contentManagerRegister(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse, RegisterRequest>('/content-manager/register', userData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Content manager registration failed');
      }
      throw error;
    }
  }

  static async contentManagerLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse, LoginRequest>('/content-manager/login', credentials);
      if (response.data?.accessToken) {
        apiClient.setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Content manager login failed');
      }
      throw error;
    }
  }

  // Admin management endpoints
  static async getContentManagers(params?: PaginationParams): Promise<ContentManager[]> {
    try {
      const response = await apiClient.get<ContentManager[]>('/admin/content-managers', { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get content managers');
      }
      throw error;
    }
  }

  static async createContentManager(managerData: UserDto): Promise<ApiResponse<ContentManager>> {
    try {
      const response = await apiClient.post<ApiResponse<ContentManager>, UserDto>('/admin/content-managers', managerData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create content manager');
      }
      throw error;
    }
  }

  static async updateContentManager(email: string, managerData: Partial<UserDto>): Promise<ApiResponse<ContentManager>> {
    try {
      const response = await apiClient.put<ApiResponse<ContentManager>, Partial<UserDto>>(`/admin/content-managers/${email}`, managerData);
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

  static async getAdmins(params?: PaginationParams): Promise<Admin[]> {
    try {
      const response = await apiClient.get<Admin[]>('/admin/admin', { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get admins');
      }
      throw error;
    }
  }

  static async createAdmin(adminData: UserDto): Promise<ApiResponse<Admin>> {
    try {
      const response = await apiClient.post<ApiResponse<Admin>, UserDto>('/admin/admin', adminData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create admin');
      }
      throw error;
    }
  }

  static async updateAdmin(email: string, adminData: Partial<UserDto>): Promise<ApiResponse<Admin>> {
    try {
      const response = await apiClient.put<ApiResponse<Admin>, Partial<UserDto>>(`/admin/admin/${email}`, adminData);
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

  // Search endpoint
  static async search(searchParams: SearchRequest): Promise<Flat[]> {
    try {
      const response = await apiClient.post<Flat[], SearchRequest>('/search', searchParams);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Search failed');
      }
      throw error;
    }
  }

  // Public endpoints for apartments and complexes
  static async getApartments(params?: PaginationParams): Promise<Flat[]> {
    try {
      const response = await apiClient.get<Flat[]>('/flats', { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get apartments');
      }
      throw error;
    }
  }

  static async getApartmentById(id: number): Promise<Flat | null> {
    try {
      const response = await apiClient.get<Flat>(`/flats/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get apartment');
      }
      throw error;
    }
  }

  static async getComplexes(params?: PaginationParams): Promise<Home[]> {
    try {
      const response = await apiClient.get<Home[]>('/homes', { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get complexes');
      }
      throw error;
    }
  }

  static async getComplexById(id: number): Promise<Home | null> {
    try {
      const response = await apiClient.get<Home>(`/homes/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get complex');
      }
      throw error;
    }
  }

  static async getApartmentsByComplex(complexId: number, params?: PaginationParams): Promise<FlatWithCategory[]> {
    try {
      const response = await apiClient.get<FlatWithCategory[]>(`/homes/${complexId}/flats`, { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get apartments for complex');
      }
      throw error;
    }
  }

  static async getCategories(params?: PaginationParams): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/categories', { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get categories');
      }
      throw error;
    }
  }

  static async getApartmentsByCategory(categoryId: number, params?: PaginationParams): Promise<FlatWithCategory[]> {
    try {
      const response = await apiClient.get<FlatWithCategory[]>(`/flats/categories/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get apartments for category');
      }
      throw error;
    }
  }

  // Request creation
  static async createRequest(requestData: RequestCreate): Promise<RequestsPost201Response> {
    try {
      const response = await apiClient.post<RequestsPost201Response, RequestCreate>('/bids', requestData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create request');
      }
      throw error;
    }
  }

  // Content management endpoints (for content managers)
  static async createApartment(apartmentData: any): Promise<ApiResponse<Flat>> {
    try {
      const response = await apiClient.post<ApiResponse<Flat>, any>('/content/apartments', apartmentData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create apartment');
      }
      throw error;
    }
  }

  static async updateApartment(id: number, apartmentData: any): Promise<ApiResponse<Flat>> {
    try {
      const response = await apiClient.put<ApiResponse<Flat>, any>(`/content/apartments/${id}`, apartmentData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update apartment');
      }
      throw error;
    }
  }

  static async deleteApartment(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/content/apartments/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete apartment');
      }
      throw error;
    }
  }

  static async createComplex(complexData: any): Promise<ApiResponse<Home>> {
    try {
      const response = await apiClient.post<ApiResponse<Home>, any>('/content/complexes', complexData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create complex');
      }
      throw error;
    }
  }

  static async updateComplex(id: number, complexData: any): Promise<ApiResponse<Home>> {
    try {
      const response = await apiClient.put<ApiResponse<Home>, any>(`/content/complexes/${id}`, complexData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update complex');
      }
      throw error;
    }
  }

  static async deleteComplex(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/content/complexes/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete complex');
      }
      throw error;
    }
  }
}

// Export individual functions for easier importing
export const {
  adminLogin,
  adminRegister,
  refreshToken,
  contentManagerRegister,
  contentManagerLogin,
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  search,
  getApartments,
  getApartmentById,
  getComplexes,
  getComplexById,
  getApartmentsByComplex,
  getCategories,
  getApartmentsByCategory,
  createRequest,
  createApartment,
  updateApartment,
  deleteApartment,
  createComplex,
  updateComplex,
  deleteComplex,
} = NewApiService;