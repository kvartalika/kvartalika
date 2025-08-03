import {apiClient} from './api.config';
import type {
  ApiResponse,
  BidRequest,
  Category, DirectoriesChildrenResponse, DirectoriesResponse, FilesResponse,
  FileUploadResponse,
  FlatWithCategoryRequest,
  HomeRequest,
  Photo,
} from './api.types';
import {AxiosError} from 'axios';
import type {BidForm} from "../store";

export class ContentService {
  static async createCategory(categoryData: Category): Promise<void> {
    return ContentService.safeRequest(() =>
      apiClient.post<void, Category>('/categories', categoryData)
    );
  }

  static async updateCategory(id: number, categoryData: Category): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.put<void, Category>(`/categories/${id}`, categoryData),
      'Category not found',
      404
    );
  }

  static async deleteCategory(id: number): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.delete<void>(`/categories/${id}`),
      'Category not found',
      404
    );
  }

  // === DIRECTORIES ===
  static async listDirectories(): Promise<DirectoriesResponse> {
    return ContentService.safeRequest(() => apiClient.get<DirectoriesResponse>('/directories'));
  }

  static async getDirectory(pathParts: string[]): Promise<DirectoriesChildrenResponse> {
    const path = pathParts.map(encodeURIComponent).join('/');
    return ContentService.safeRequest(() => apiClient.get<DirectoriesChildrenResponse>(`/directories/${path}`));
  }

  static async createDirectory(pathParts: string[]): Promise<void> {
    const path = pathParts.map(encodeURIComponent).join('/');
    return ContentService.safeRequest(() => apiClient.post(`/directories/${path}`));
  }

  static async deleteDirectory(pathParts: string[]): Promise<void> {
    const path = pathParts.map(encodeURIComponent).join('/');
    return ContentService.safeRequest(() => apiClient.delete(`/directories/${path}`));
  }

  // === FILES ===
  static async listFilesInDir(dirParts: string[]): Promise<FilesResponse> {
    const dir = dirParts.map(encodeURIComponent).join('/');
    return ContentService.safeRequest(() => apiClient.get<FilesResponse>(`/files/list/${dir}`));
  }

  static async getFile(pathParts: string[]): Promise<Blob> {
    const path = pathParts.map(encodeURIComponent).join('/');
    try {
      const resp = await apiClient.get<Blob>(`/files/${path}`, {responseType: 'blob'});
      return resp.data;
    } catch (err) {
      this.handleError(err, 'Failed to get file');
    }
  }

  static async downloadFile(pathParts: string[]): Promise<Blob> {
    const path = pathParts.map(encodeURIComponent).join('/');
    try {
      const resp = await apiClient.get<Blob>(`/files/${path}`, {responseType: 'blob'});
      return resp.data;
    } catch (err) {
      this.handleError(err, 'Failed to download file');
    }
  }

  static async uploadFile(dirParts: string[], file: File): Promise<void> {
    const dir = dirParts.map(encodeURIComponent).join('/');
    const form = new FormData();
    form.append('file', file);
    return ContentService.safeRequest(() => apiClient.postForm(`/files/upload/${dir}`, form));
  }

  static async deleteFile(pathParts: string[]): Promise<void> {
    const path = pathParts.map(encodeURIComponent).join('/');
    return ContentService.safeRequest(() => apiClient.delete(`/files/${path}`));
  }

  // Bids
  static async getAllBids(): Promise<BidForm[]> {
    return ContentService.safeRequest(() =>
        apiClient.get<BidForm[]>(`/bids`),
      'Bid not found',
      404
    );
  }

  static async getBid(id: string | number): Promise<BidForm> {
    return ContentService.safeRequest(() =>
        apiClient.get<BidForm>(`/bids/${id}`),
      'Bid not found',
      404
    );
  }

  static async updateBid(id: string | number, data: BidRequest): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.put<void, BidRequest>(`/bids/${id}`, data),
      'Bid not found',
      404
    );
  }

  static async deleteBid(id: string | number): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.delete<void>(`/bids/${id}`),
      'Bid not found',
      404
    );
  }


  // Flats Management
  static async createFlat(data: FlatWithCategoryRequest): Promise<void> {
    return ContentService.safeRequest(() =>
      apiClient.post<void, FlatWithCategoryRequest>('/flats', data)
    );
  }

  static async updateFlat(id: number, data: FlatWithCategoryRequest): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.put<void, FlatWithCategoryRequest>(`/flats/${id}`, data),
      'Flat not found',
      404
    );
  }

  static async deleteFlat(id: number): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.delete<void>(`/flats/${id}`),
      'Flat not found',
      404
    );
  }

  static async addCategoryToFlat(flatId: number, categoryId: number): Promise<void> {
    return ContentService.safeRequest(() =>
      apiClient.post(`/flats/${flatId}/categories/${categoryId}`)
    );
  }

  static async removeCategoryFromFlat(flatId: number, categoryId: number): Promise<void> {
    return ContentService.safeRequest(() =>
      apiClient.delete(`/flats/${flatId}/categories/${categoryId}`)
    );
  }

  // Homes Management
  static async createHome(data: HomeRequest): Promise<void> {
    return ContentService.safeRequest(() =>
      apiClient.post<void, HomeRequest>('/homes', data)
    );
  }

  static async updateHome(id: number, data: HomeRequest): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.put<void, HomeRequest>(`/homes/${id}`, data),
      'Home not found',
      404
    );
  }

  static async deleteHome(id: number): Promise<void> {
    return ContentService.safeRequest(() =>
        apiClient.delete<void>(`/homes/${id}`),
      'Home not found',
      404
    );
  }

  // Photos Management
  static async uploadPhoto(file: File, altText?: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    if (altText) formData.append('altText', altText);

    return ContentService.safeRequest(() =>
        apiClient.postForm<FileUploadResponse>('/photos', formData),
      'Photo file is required',
      400
    );
  }

  static async updatePhoto(id: number, file?: File, altText?: string): Promise<ApiResponse<Photo>> {
    const formData = new FormData();
    if (file) formData.append('photo', file);
    if (altText) formData.append('altText', altText);

    return ContentService.safeRequest(() =>
        apiClient.putForm<ApiResponse<Photo>>(`/photos/id${id}`, formData),
      'Photo not found',
      404
    );
  }

  static async deletePhoto(id: number): Promise<ApiResponse<void>> {
    return ContentService.safeRequest(() =>
        apiClient.delete<ApiResponse<void>>(`/photos/id${id}`),
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
  listDirectories,
  getDirectory,
  getBid,
  getAllBids,
  createDirectory,
  deleteDirectory,
  listFilesInDir,
  getFile,
  deleteBid,
  downloadFile,
  updateBid,
  uploadFile,
  deleteFile,
  addCategoryToFlat,
  removeCategoryFromFlat,
  createCategory,
  updateCategory,
  deleteCategory,
  createFlat,
  updateFlat,
  deleteFlat,
  createHome,
  updateHome,
  deleteHome,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  bulkUploadPhotos,
  bulkDeletePhotos,
} = ContentService;