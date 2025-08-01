import {apiClient} from './api.config';
import type {
  Category,
  Description, FlatWithCategoryRequest,
  Footer,
  HomeRequest,
  PaginatedResponse,
  PaginationParams,
  Photo,
  RequestCreate,
  RequestsPost201Response,
  SearchRequest,
} from './api.types';
import {AxiosError} from "axios";
import type {PageInfo, SocialMedia} from "../store";

export class PublicService {
  // Page Info
  static async getPageInfo(params?: PaginationParams): Promise<PageInfo> {
    try {
      const response = await apiClient.get<PageInfo>('/page_info', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get Page Info');
      }
      throw error;
    }
  }

  static async updatePageInfo(data: PageInfo, params?: PaginationParams): Promise<void> {
    try {
      const response = await apiClient.put<void, PageInfo>('/page_info', data, {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update Page Info');
      }
      throw error;
    }
  }

  // Social Media
  static async getSocialMedia(params?: PaginationParams): Promise<SocialMedia[]> {
    try {
      const response = await apiClient.get<SocialMedia[]>('/social_media', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get Social Media');
      }
      throw error;
    }
  }

  static async updateSocialMedia(data: SocialMedia[], params?: PaginationParams): Promise<void> {
    try {
      const response = await apiClient.put<void, SocialMedia[]>('/social_media', data, {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update Social Media');
      }
      throw error;
    }
  }

  static async addSocialMedia(data: SocialMedia, params?: PaginationParams): Promise<void> {
    try {
      const response = await apiClient.post<void, SocialMedia>('/social_media', data, {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update Social Media');
      }
      throw error;
    }
  }

  static async deleteSocialMedia(id: number, params?: PaginationParams): Promise<void> {
    try {
      const response = await apiClient.delete<void>(`/social_media/${id}`, {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update Social Media');
      }
      throw error;
    }
  }

  // Categories - Public Read
  static async getCategories(params?: PaginationParams): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/categories', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get categories');
      }
      throw error;
    }
  }

  static async getCategoryById(id: number): Promise<Category | null> {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get category');
      }
      throw error;
    }
  }

  // Descriptions - Public Read
  static async getDescriptions(params?: PaginationParams): Promise<Description[]> {
    try {
      const response = await apiClient.get<Description[]>('/descriptions', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get descriptions');
      }
      throw error;
    }
  }

  static async getDescriptionById(id: number): Promise<Description | null> {
    try {
      const response = await apiClient.get<Description>(`/descriptions/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get description');
      }
      throw error;
    }
  }

  // Flats - Public Read
  static async getFlats(params?: PaginationParams): Promise<FlatWithCategoryRequest[]> {
    try {
      const response = await apiClient.get<FlatWithCategoryRequest[]>('/flats', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get flats');
      }
      throw error;
    }
  }

  static async getFlatById(id: number): Promise<FlatWithCategoryRequest | null> {
    try {
      const response = await apiClient.get<FlatWithCategoryRequest>(`/flats/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get flat');
      }
      throw error;
    }
  }

  static async getFlatsByHome(homeId: number, params?: PaginationParams): Promise<FlatWithCategoryRequest[]> {
    try {
      const response = await apiClient.get<FlatWithCategoryRequest[]>(`/homes/${homeId}/flats`, {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get flats for home');
      }
      throw error;
    }
  }

  // Homes - Public Read
  static async getHomes(params?: PaginationParams): Promise<HomeRequest[]> {
    try {
      const response = await apiClient.get<HomeRequest[]>('/homes', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get homes');
      }
      throw error;
    }
  }

  static async getHomeById(id: number): Promise<HomeRequest | null> {
    try {
      const response = await apiClient.get<HomeRequest>(`/homes/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get home');
      }
      throw error;
    }
  }

  static async getFlatsByCategory(categoryId: number, params?: PaginationParams): Promise<FlatWithCategoryRequest[]> {
    try {
      const response = await apiClient.get<FlatWithCategoryRequest[]>(`/flats/categories/${categoryId}`, {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get flats for category');
      }
      throw error;
    }
  }

  static async getPhotos(params?: PaginationParams): Promise<Photo[]> {
    try {
      const response = await apiClient.get<Photo[]>('/photos', {params});
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get photos');
      }
      throw error;
    }
  }

  static async getPhotoById(id: number): Promise<Photo | null> {
    try {
      const response = await apiClient.get<Photo>(`/photos/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get photo');
      }
      throw error;
    }
  }

  static async getFooter(): Promise<Footer | null> {
    try {
      const response = await apiClient.get<Footer>('/footer');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to get footer');
      }
      throw error;
    }
  }

  static async searchFlats(searchParams: SearchRequest): Promise<FlatWithCategoryRequest[]> {
    try {
      const response = await apiClient.post<FlatWithCategoryRequest[], SearchRequest>('/search', searchParams);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Search failed');
      }
      throw error;
    }
  }

  static async advancedSearch(searchParams: SearchRequest & PaginationParams): Promise<PaginatedResponse<FlatWithCategoryRequest>> {
    try {
      const response = await apiClient.post<PaginatedResponse<FlatWithCategoryRequest>, SearchRequest & PaginationParams>('/search/advanced', searchParams);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Advanced search failed');
      }
      throw error;
    }
  }

  // Requests - Public Create
  static async createRequest(requestData: RequestCreate): Promise<RequestsPost201Response> {
    try {
      const response = await apiClient.post<RequestsPost201Response, RequestCreate>('/bids', requestData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new Error('Invalid request data');
        }
        throw new Error(error.response?.data?.message || 'Failed to create request');
      }
      throw error;
    }
  }

  // Location and Map data
  // static async getNearbyAmenities(homeId: number): Promise<any[]> {
  //   try {
  //     const response = await apiClient.get<any[]>(`/homes/${homeId}/amenities`);
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Failed to get nearby amenities');
  //   }
  // }
  //
  // static async getMapData(bounds?: {
  //   north: number;
  //   south: number;
  //   east: number;
  //   west: number;
  // }): Promise<any[]> {
  //   try {
  //     const response = await apiClient.get<any[]>('/map/data', {params: bounds});
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Failed to get map data');
  //   }
  // }
}

export const {
  getPageInfo,
  getSocialMedia,
  updateSocialMedia,
  addSocialMedia,
  deleteSocialMedia,
  getCategories,
  getCategoryById,
  getDescriptions,
  getDescriptionById,
  getFlats,
  getFlatById,
  getFlatsByHome,
  getHomes,
  getHomeById,
  getFlatsByCategory,
  getPhotos,
  getPhotoById,
  getFooter,
  searchFlats,
  updatePageInfo,
  advancedSearch,
  createRequest,
} = PublicService;