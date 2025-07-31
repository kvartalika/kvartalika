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
} from './api.types';
import { AxiosError } from 'axios';

export class ContentService {
  // Categories Management
  static async createCategory(categoryData: CategoryRequest): Promise<ApiResponse<Category>> {
    return ContentService.safeRequest(() =>
      apiClient.post<ApiResponse<Category>, CategoryRequest>('/content/categories', categoryData)
    );
  }

  static async updateCategory(id: number, categoryData: CategoryRequest): Promise<ApiResponse<Category>> {
    return ContentService.safeRequest(() =>
        apiClient.put<ApiResponse<Category>, CategoryRequest>(`/content/categories?id=${id}`, categoryData),
      'Category not found',
      404
    );
  }

  static async deleteCategory(id: number): Promise<ApiResponse<void>> {
    return ContentService.safeRequest(() =>
        apiClient.delete<ApiResponse<void>>(`/content/categories?id=${id}`),
      'Category not found',
      404
    );
  }

  // Descriptions Management
  static async createDescription(data: DescriptionRequest): Promise<ApiResponse<Description>> {
    return ContentService.safeRequest(() =>
      apiClient.post<ApiResponse<Description>, DescriptionRequest>('/content/descriptions', data)
    );
  }

  static async updateDescription(id: number, data: DescriptionRequest): Promise<ApiResponse<Description>> {
    return ContentService.safeRequest(() =>
        apiClient.put<ApiResponse<Description>, DescriptionRequest>(`/content/descriptions?id=${id}`, data),
      'Description not found',
      404
    );
  }

  static async deleteDescription(id: number): Promise<ApiResponse<void>> {
    return ContentService.safeRequest(() =>
        apiClient.delete<ApiResponse<void>>(`/content/descriptions?id=${id}`),
      'Description not found',
      404
    );
  }

  // Flats Management
  static async createFlat(data: FlatRequest): Promise<ApiResponse<Flat>> {
    return ContentService.safeRequest(() =>
      apiClient.post<ApiResponse<Flat>, FlatRequest>('/content/flats', data)
    );
  }

  static async updateFlat(id: number, data: FlatRequest): Promise<ApiResponse<Flat>> {
    return ContentService.safeRequest(() =>
        apiClient.put<ApiResponse<Flat>, FlatRequest>(`/content/flats?id=${id}`, data),
      'Flat not found',
      404
    );
  }

  static async deleteFlat(id: number): Promise<ApiResponse<void>> {
    return ContentService.safeRequest(() =>
        apiClient.delete<ApiResponse<void>>(`/content/flats?id=${id}`),
      'Flat not found',
      404
    );
  }

  // Homes Management
  static async createHome(data: HomeRequest): Promise<ApiResponse<Home>> {
    return ContentService.safeRequest(() =>
      apiClient.post<ApiResponse<Home>, HomeRequest>('/content/homes', data)
    );
  }

  static async updateHome(id: number, data: HomeRequest): Promise<ApiResponse<Home>> {
    return ContentService.safeRequest(() =>
        apiClient.put<ApiResponse<Home>, HomeRequest>(`/content/homes?id=${id}`, data),
      'Home not found',
      404
    );
  }

  static async deleteHome(id: number): Promise<ApiResponse<void>> {
    return ContentService.safeRequest(() =>
        apiClient.delete<ApiResponse<void>>(`/content/homes?id=${id}`),
      'Home not found',
      404
    );
  }

  // Footer Management
  static async createFooter(data: FooterRequest): Promise<ApiResponse<Footer>> {
    return ContentService.safeRequest(() =>
      apiClient.post<ApiResponse<Footer>, FooterRequest>('/content/footer', data)
    );
  }

  static async updateFooter(id: number, data: FooterRequest): Promise<ApiResponse<Footer>> {
    return ContentService.safeRequest(() =>
        apiClient.put<ApiResponse<Footer>, FooterRequest>(`/content/footer?id=${id}`, data),
      'Footer not found',
      404
    );
  }

  // Photos Management
  static async uploadPhoto(file: File, altText?: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    if (altText) formData.append('altText', altText);

    return ContentService.safeRequest(() =>
        apiClient.postForm<FileUploadResponse>('/content/photos', formData),
      'Photo file is required',
      400
    );
  }

  static async updatePhoto(id: number, file?: File, altText?: string): Promise<ApiResponse<Photo>> {
    const formData = new FormData();
    if (file) formData.append('photo', file);
    if (altText) formData.append('altText', altText);

    return ContentService.safeRequest(() =>
        apiClient.putForm<ApiResponse<Photo>>(`/content/photos?id=${id}`, formData),
      'Photo not found',
      404
    );
  }

  static async deletePhoto(id: number): Promise<ApiResponse<void>> {
    return ContentService.safeRequest(() =>
        apiClient.delete<ApiResponse<void>>(`/content/photos?id=${id}`),
      'Photo not found',
      404
    );
  }

  static async bulkUploadPhotos(files: File[]): Promise<FileUploadResponse[]> {
    return Promise.all(files.map(file => this.uploadPhoto(file)));
  }

  static async bulkDeletePhotos(photoIds: number[]): Promise<ApiResponse<void>[]> {
    return Promise.all(photoIds.map(id => this.deletePhoto(id)));
  }

  private static async safeRequest<T>(
    fn: () => Promise<{ data: T }>,
    notFoundMessage?: string,
    notFoundCode = 404
  ): Promise<T> {
    try {
      const response = await fn();
      return response.data;
    } catch (error) {
      ContentService.handleError(error, 'Request failed', notFoundMessage, notFoundCode);
    }
  }

  private static handleError(error: unknown, defaultMessage: string, notFoundMessage?: string, notFoundCode = 404): never {
    if (error instanceof AxiosError) {
      if (error.response?.status === notFoundCode && notFoundMessage) {
        throw new Error(notFoundMessage);
      }
      throw new Error(error.response?.data?.message || defaultMessage);
    }
    throw error;
  }
}

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
} = ContentService;