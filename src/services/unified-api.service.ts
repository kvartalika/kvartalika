// Unified API Service
// Consolidates all API services into a single interface

import type {
  Apartment,
  Complex,
  BookingForm,
  SearchFilters,
  LoginRequest,
  AuthResponse,
  Category,
  FlatRequest,
  HomeRequest,
  MainPageContent,
  UserDto,
} from '../types/unified';

class UnifiedApiService {
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // TODO: Implement real login API
      throw new Error('Login not implemented yet');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const { adminLogin } = await import('./auth.service');
      const result = await adminLogin(credentials);
      return {
        user: {
          name: result.name || '',
          surname: result.surname || '',
          patronymic: result.patronymic,
          email: result.email || '',
          phone: result.phone,
          role: 'ADMIN' as any,
          id: result.id,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          telegramId: result.telegramId,
        },
        accessToken: result.accessToken || '',
        role: 'ADMIN' as any,
      };
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async contentManagerLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const { contentManagerLogin } = await import('./auth.service');
      const result = await contentManagerLogin(credentials);
      return {
        user: {
          name: result.name || '',
          surname: result.surname || '',
          patronymic: result.patronymic,
          email: result.email || '',
          phone: result.phone,
          role: 'CONTENT_MANAGER' as any,
          id: result.id,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          telegramId: result.telegramId,
        },
        accessToken: result.accessToken || '',
        role: 'CONTENT_MANAGER' as any,
      };
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

  // Stub methods for APIs that need to be implemented
  async getApartments(): Promise<Apartment[]> {
    console.warn('getApartments not yet implemented');
    return [];
  }

  async getApartmentById(id: number): Promise<Apartment | null> {
    console.warn('getApartmentById not yet implemented');
    return null;
  }

  async createApartment(data: FlatRequest): Promise<Apartment> {
    console.warn('createApartment not yet implemented');
    throw new Error('Not implemented');
  }

  async updateApartment(id: number, data: Partial<FlatRequest>): Promise<Apartment> {
    console.warn('updateApartment not yet implemented');
    throw new Error('Not implemented');
  }

  async deleteApartment(id: number): Promise<boolean> {
    console.warn('deleteApartment not yet implemented');
    return false;
  }

  async getComplexes(): Promise<Complex[]> {
    console.warn('getComplexes not yet implemented');
    return [];
  }

  async getComplexById(id: number): Promise<Complex | null> {
    console.warn('getComplexById not yet implemented');
    return null;
  }

  async createComplex(data: HomeRequest): Promise<Complex> {
    console.warn('createComplex not yet implemented');
    throw new Error('Not implemented');
  }

  async updateComplex(id: number, data: Partial<HomeRequest>): Promise<Complex> {
    console.warn('updateComplex not yet implemented');
    throw new Error('Not implemented');
  }

  async deleteComplex(id: number): Promise<boolean> {
    console.warn('deleteComplex not yet implemented');
    return false;
  }

  async searchApartments(filters: Partial<SearchFilters>): Promise<Apartment[]> {
    console.warn('searchApartments not yet implemented');
    return [];
  }

  async createBooking(bookingData: BookingForm): Promise<{ success: boolean; id?: number }> {
    console.warn('createBooking not yet implemented');
    return { success: false };
  }

  async getCategories(): Promise<Category[]> {
    try {
      const { getCategories } = await import('./public.service');
      return await getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getMainPageContent(): Promise<MainPageContent> {
    console.warn('getMainPageContent not yet implemented');
    throw new Error('Not implemented');
  }

  async updateMainPageContent(data: Partial<MainPageContent>): Promise<MainPageContent> {
    console.warn('updateMainPageContent not yet implemented');
    throw new Error('Not implemented');
  }

  async getContactInfo(): Promise<any> {
    console.warn('getContactInfo not yet implemented');
    return {};
  }

  async updateContactInfo(data: any): Promise<any> {
    console.warn('updateContactInfo not yet implemented');
    return {};
  }

  async getSocialMedia(): Promise<any[]> {
    try {
      const { getSocialMedia } = await import('./public.service');
      return await getSocialMedia();
    } catch (error) {
      console.error('Error fetching social media:', error);
      return [];
    }
  }

  async addSocialMedia(data: { image: string; link: string }): Promise<any> {
    try {
      const { addSocialMedia } = await import('./public.service');
      return await addSocialMedia(data);
    } catch (error) {
      console.error('Error adding social media:', error);
      throw error;
    }
  }

  async updateSocialMedia(id: number, data: Partial<{ image: string; link: string }>): Promise<any> {
    try {
      const { updateSocialMedia } = await import('./public.service');
      return await updateSocialMedia(id, data);
    } catch (error) {
      console.error('Error updating social media:', error);
      throw error;
    }
  }

  async deleteSocialMedia(id: number): Promise<boolean> {
    try {
      const { deleteSocialMedia } = await import('./public.service');
      return await deleteSocialMedia(id);
    } catch (error) {
      console.error('Error deleting social media:', error);
      return false;
    }
  }

  async getAdmins(): Promise<UserDto[]> {
    try {
      const { getAdmins } = await import('./admin.service');
      return await getAdmins();
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  }

  async getContentManagers(): Promise<UserDto[]> {
    try {
      const { getContentManagers } = await import('./admin.service');
      return await getContentManagers();
    } catch (error) {
      console.error('Error fetching content managers:', error);
      return [];
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