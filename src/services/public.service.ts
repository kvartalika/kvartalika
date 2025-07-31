import { apiClient } from './api.config';
import type {
  Category,
  Description,
  Flat,
  Home,
  Footer,
  Photo,
  RequestCreate,
  SearchRequest,
  RequestsPost201Response,
  PaginationParams,
  PaginatedResponse,
} from './api.types';

export class PublicService {
  // Categories - Public Read
  static async getCategories(params?: PaginationParams): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/categories', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get categories');
    }
  }

  static async getCategoryById(id: number): Promise<Category | null> {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to get category');
    }
  }

  // Descriptions - Public Read
  static async getDescriptions(params?: PaginationParams): Promise<Description[]> {
    try {
      const response = await apiClient.get<Description[]>('/descriptions', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get descriptions');
    }
  }

  static async getDescriptionById(id: number): Promise<Description | null> {
    try {
      const response = await apiClient.get<Description>(`/descriptions/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to get description');
    }
  }

  // Flats - Public Read
  static async getFlats(params?: PaginationParams): Promise<Flat[]> {
    try {
      const response = await apiClient.get<Flat[]>('/flats', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get flats');
    }
  }

  static async getFlatById(id: number): Promise<Flat | null> {
    try {
      const response = await apiClient.get<Flat>(`/flats/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to get flat');
    }
  }

  static async getFlatsByHome(homeId: number, params?: PaginationParams): Promise<Flat[]> {
    try {
      const response = await apiClient.get<Flat[]>(`/homes/${homeId}/flats`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get flats for home');
    }
  }

  // Homes - Public Read
  static async getHomes(params?: PaginationParams): Promise<Home[]> {
    try {
      const response = await apiClient.get<Home[]>('/homes', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get homes');
    }
  }

  static async getHomeById(id: number): Promise<Home | null> {
    try {
      const response = await apiClient.get<Home>(`/homes/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to get home');
    }
  }

  static async getHomesByCategory(categoryId: number, params?: PaginationParams): Promise<Home[]> {
    try {
      const response = await apiClient.get<Home[]>(`/categories/${categoryId}/homes`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get homes for category');
    }
  }

  // Photos - Public Read
  static async getPhotos(params?: PaginationParams): Promise<Photo[]> {
    try {
      const response = await apiClient.get<Photo[]>('/photos', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get photos');
    }
  }

  static async getPhotoById(id: number): Promise<Photo | null> {
    try {
      const response = await apiClient.get<Photo>(`/photos/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to get photo');
    }
  }

  // Footer - Public Read
  static async getFooter(): Promise<Footer | null> {
    try {
      const response = await apiClient.get<Footer>('/footer');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to get footer');
    }
  }

  // Search
  static async searchHomes(searchParams: SearchRequest): Promise<Home[]> {
    try {
      const response = await apiClient.post<Home[]>('/search', searchParams);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  // Advanced search with filters
  static async advancedSearch(searchParams: SearchRequest & PaginationParams): Promise<PaginatedResponse<Home>> {
    try {
      const response = await apiClient.post<PaginatedResponse<Home>>('/search/advanced', searchParams);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Advanced search failed');
    }
  }

  // Requests - Public Create
  static async createRequest(requestData: RequestCreate): Promise<RequestsPost201Response> {
    try {
      const response = await apiClient.post<RequestsPost201Response>('/requests', requestData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid request data');
      }
      throw new Error(error.response?.data?.message || 'Failed to create request');
    }
  }

  // Statistics and Analytics (public)
  static async getPublicStats(): Promise<any> {
    try {
      const response = await apiClient.get<any>('/stats/public');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get public stats');
    }
  }

  // Featured/Popular content
  static async getFeaturedHomes(limit?: number): Promise<Home[]> {
    try {
      const response = await apiClient.get<Home[]>('/homes/featured', {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get featured homes');
    }
  }

  static async getPopularFlats(limit?: number): Promise<Flat[]> {
    try {
      const response = await apiClient.get<Flat[]>('/flats/popular', {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get popular flats');
    }
  }

  // Filter Options (for search forms)
  static async getFilterOptions(): Promise<{
    priceRanges: { min: number; max: number }[];
    roomCounts: number[];
    areas: { min: number; max: number }[];
    amenities: string[];
  }> {
    try {
      const response = await apiClient.get<any>('/search/filters');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get filter options');
    }
  }

  // Location and Map data
  static async getNearbyAmenities(homeId: number): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(`/homes/${homeId}/amenities`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get nearby amenities');
    }
  }

  static async getMapData(bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('/map/data', { params: bounds });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get map data');
    }
  }
}

// Export individual methods for easier importing
export const {
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
} = PublicService;