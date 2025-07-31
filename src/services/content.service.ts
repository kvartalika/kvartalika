import { apiClient } from './api.config';
import type {
  CategoryRequest,
  DescriptionRequest,
  FlatRequest,
  HomeRequest,
  FooterRequest,
  Category,
  Description,
  Flat,
  Home,
  Footer,
  Photo,
  ApiResponse,
  FileUploadResponse,
  PaginationParams,
} from './api.types';

export class ContentService {
  // Categories Management
  static async createCategory(categoryData: CategoryRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content/categories', categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  static async updateCategory(id: number, categoryData: CategoryRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(
        `/content/categories?id=${id}`,
        categoryData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  static async deleteCategory(id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/content/categories?id=${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }

  // Descriptions Management
  static async createDescription(descriptionData: DescriptionRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content/descriptions', descriptionData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create description');
    }
  }

  static async updateDescription(id: number, descriptionData: DescriptionRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(
        `/content/descriptions?id=${id}`,
        descriptionData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Description not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update description');
    }
  }

  static async deleteDescription(id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/content/descriptions?id=${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Description not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete description');
    }
  }

  // Flats Management
  static async createFlat(flatData: FlatRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content/flats', flatData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create flat');
    }
  }

  static async updateFlat(id: number, flatData: FlatRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(`/content/flats?id=${id}`, flatData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Flat not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update flat');
    }
  }

  static async deleteFlat(id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/content/flats?id=${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Flat not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete flat');
    }
  }

  // Homes Management
  static async createHome(homeData: HomeRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content/homes', homeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create home');
    }
  }

  static async updateHome(id: number, homeData: HomeRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(`/content/homes?id=${id}`, homeData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Home not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update home');
    }
  }

  static async deleteHome(id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/content/homes?id=${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Home not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete home');
    }
  }

  // Footer Management
  static async createFooter(footerData: FooterRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content/footer', footerData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create footer');
    }
  }

  static async updateFooter(id: number, footerData: FooterRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(`/content/footer?id=${id}`, footerData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Footer not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update footer');
    }
  }

  // Photos Management
  static async uploadPhoto(file: File, altText?: string): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      if (altText) {
        formData.append('altText', altText);
      }

      const response = await apiClient.postForm<FileUploadResponse>('/content/photos', formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Photo file is required');
      }
      throw new Error(error.response?.data?.message || 'Failed to upload photo');
    }
  }

  static async updatePhoto(id: number, file?: File, altText?: string): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('photo', file);
      }
      if (altText) {
        formData.append('altText', altText);
      }

      const response = await apiClient.putForm<ApiResponse>(`/content/photos?id=${id}`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid photo ID');
      }
      if (error.response?.status === 404) {
        throw new Error('Photo not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update photo');
    }
  }

  static async deletePhoto(id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/content/photos?id=${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid photo ID');
      }
      if (error.response?.status === 404) {
        throw new Error('Photo not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete photo');
    }
  }

  // Bulk Operations
  static async bulkUploadPhotos(files: File[]): Promise<FileUploadResponse[]> {
    try {
      const uploadPromises = files.map(file => this.uploadPhoto(file));
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      throw new Error('Failed to upload some photos');
    }
  }

  static async bulkDeletePhotos(photoIds: number[]): Promise<ApiResponse[]> {
    try {
      const deletePromises = photoIds.map(id => this.deletePhoto(id));
      return await Promise.all(deletePromises);
    } catch (error: any) {
      throw new Error('Failed to delete some photos');
    }
  }

  // Content Templates and Presets
  static async getContentTemplates(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('/content/templates');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get content templates');
    }
  }

  static async createContentTemplate(templateData: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/content/templates', templateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create content template');
    }
  }
}

// Export individual methods for easier importing
export const {
  createCategory,
  updateCategory,
  deleteCategory,
  createDescription,
  updateDescription,
  deleteDescription,
  createFlat,
  updateFlat,
  deleteFlat,
  createHome,
  updateHome,
  deleteHome,
  createFooter,
  updateFooter,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  bulkUploadPhotos,
  bulkDeletePhotos,
  getContentTemplates,
  createContentTemplate,
} = ContentService;