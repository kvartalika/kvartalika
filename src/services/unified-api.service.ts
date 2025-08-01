// Unified API Service
// Consolidates all API services into a single interface

import type {
  Apartment,
  Complex,
  BookingForm,
  SearchFilters,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Category,
  Flat,
  Home,
  FlatRequest,
  HomeRequest,
  MainPageContent,
  UserDto,
} from '../types/unified';

class UnifiedApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('unified-auth-storage') 
      ? JSON.parse(localStorage.getItem('unified-auth-storage')!).state.accessToken 
      : null;
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const { mockApi } = await import('./mockApi');
      return await mockApi.login(credentials.email, credentials.password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const { adminLogin } = await import('./auth.service');
      return await adminLogin(credentials);
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async contentManagerLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const { contentManagerLogin } = await import('./auth.service');
      return await contentManagerLogin(credentials);
    } catch (error) {
      console.error('Content manager login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const { logout } = await import('./auth.service');
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Apartments endpoints
  async getApartments(): Promise<Apartment[]> {
    try {
      // Try content API first, fall back to mock
      try {
        const { contentApi } = await import('./contentApi');
        return await contentApi.getApartments();
      } catch {
        const { ApiService } = await import('./apiService');
        return await ApiService.getApartments();
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
      throw error;
    }
  }

  async getApartmentById(id: number): Promise<Apartment | null> {
    try {
      // Try content API first, fall back to mock
      try {
        const { contentApi } = await import('./contentApi');
        return await contentApi.getApartment(id);
      } catch {
        const { ApiService } = await import('./apiService');
        return await ApiService.getApartmentById(id);
      }
    } catch (error) {
      console.error('Error fetching apartment:', error);
      throw error;
    }
  }

  async createApartment(data: FlatRequest): Promise<Apartment> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.createApartment(data);
    } catch (error) {
      console.error('Error creating apartment:', error);
      throw error;
    }
  }

  async updateApartment(id: number, data: Partial<FlatRequest>): Promise<Apartment> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.updateApartment(id, data);
    } catch (error) {
      console.error('Error updating apartment:', error);
      throw error;
    }
  }

  async deleteApartment(id: number): Promise<boolean> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.deleteApartment(id);
    } catch (error) {
      console.error('Error deleting apartment:', error);
      throw error;
    }
  }

  // Complexes endpoints
  async getComplexes(): Promise<Complex[]> {
    try {
      // Try content API first, fall back to mock
      try {
        const { contentApi } = await import('./contentApi');
        return await contentApi.getComplexes();
      } catch {
        const { ApiService } = await import('./apiService');
        return await ApiService.getComplexes();
      }
    } catch (error) {
      console.error('Error fetching complexes:', error);
      throw error;
    }
  }

  async getComplexById(id: number): Promise<Complex | null> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.getComplex(id);
    } catch (error) {
      console.error('Error fetching complex:', error);
      throw error;
    }
  }

  async createComplex(data: HomeRequest): Promise<Complex> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.createComplex(data);
    } catch (error) {
      console.error('Error creating complex:', error);
      throw error;
    }
  }

  async updateComplex(id: number, data: Partial<HomeRequest>): Promise<Complex> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.updateComplex(id, data);
    } catch (error) {
      console.error('Error updating complex:', error);
      throw error;
    }
  }

  async deleteComplex(id: number): Promise<boolean> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.deleteComplex(id);
    } catch (error) {
      console.error('Error deleting complex:', error);
      throw error;
    }
  }

  // Search endpoints
  async searchApartments(filters: Partial<SearchFilters>): Promise<Apartment[]> {
    try {
      const { ApiService } = await import('./apiService');
      return await ApiService.searchApartments(filters);
    } catch (error) {
      console.error('Error searching apartments:', error);
      throw error;
    }
  }

  // Booking endpoints
  async createBooking(bookingData: BookingForm): Promise<{ success: boolean; id?: number }> {
    try {
      const { ApiService } = await import('./apiService');
      return await ApiService.createBooking(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Categories endpoints
  async getCategories(): Promise<Category[]> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Content management endpoints
  async getMainPageContent(): Promise<MainPageContent> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.getMainPageContent();
    } catch (error) {
      console.error('Error fetching main page content:', error);
      throw error;
    }
  }

  async updateMainPageContent(data: Partial<MainPageContent>): Promise<MainPageContent> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.updateMainPageContent(data);
    } catch (error) {
      console.error('Error updating main page content:', error);
      throw error;
    }
  }

  // Contact info endpoints
  async getContactInfo(): Promise<any> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.getContactInfo();
    } catch (error) {
      console.error('Error fetching contact info:', error);
      throw error;
    }
  }

  async updateContactInfo(data: any): Promise<any> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.updateContactInfo(data);
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }

  // Social media endpoints
  async getSocialMedia(): Promise<any[]> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.getSocialMedia();
    } catch (error) {
      console.error('Error fetching social media:', error);
      throw error;
    }
  }

  async addSocialMedia(data: { image: string; link: string }): Promise<any> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.addSocialMedia(data);
    } catch (error) {
      console.error('Error adding social media:', error);
      throw error;
    }
  }

  async updateSocialMedia(id: number, data: Partial<{ image: string; link: string }>): Promise<any> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.updateSocialMedia(id, data);
    } catch (error) {
      console.error('Error updating social media:', error);
      throw error;
    }
  }

  async deleteSocialMedia(id: number): Promise<boolean> {
    try {
      const { contentApi } = await import('./contentApi');
      return await contentApi.deleteSocialMedia(id);
    } catch (error) {
      console.error('Error deleting social media:', error);
      throw error;
    }
  }

  // Admin endpoints
  async getAdmins(): Promise<UserDto[]> {
    try {
      const { getAdmins } = await import('./admin.service');
      return await getAdmins();
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }

  async getContentManagers(): Promise<UserDto[]> {
    try {
      const { getContentManagers } = await import('./admin.service');
      return await getContentManagers();
    } catch (error) {
      console.error('Error fetching content managers:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const unifiedApiService = new UnifiedApiService();

// Export individual methods for backwards compatibility
export const {
  login,
  adminLogin,
  contentManagerLogin,
  logout,
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
  getComplexes,
  getComplexById,
  createComplex,
  updateComplex,
  deleteComplex,
  searchApartments,
  createBooking,
  getCategories,
  getMainPageContent,
  updateMainPageContent,
  getContactInfo,
  updateContactInfo,
  getSocialMedia,
  addSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  getAdmins,
  getContentManagers,
} = unifiedApiService;