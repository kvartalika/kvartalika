import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

export interface AuthTokens {
  adminToken?: string;
  contentToken?: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private tokens: AuthTokens = {};

  constructor(config: ApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add bearer tokens
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Determine which token to use based on the endpoint
        const url = config.url || '';
        
        if (url.startsWith('/admin') && this.tokens.adminToken) {
          config.headers.Authorization = `Bearer ${this.tokens.adminToken}`;
        } else if (url.startsWith('/content') && this.tokens.contentToken) {
          config.headers.Authorization = `Bearer ${this.tokens.contentToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearTokens();
          // Redirect to login if needed
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  setAdminToken(token: string) {
    this.tokens.adminToken = token;
    // Persist to localStorage
    localStorage.setItem('admin_token', token);
  }

  setContentToken(token: string) {
    this.tokens.contentToken = token;
    // Persist to localStorage
    localStorage.setItem('content_token', token);
  }

  clearTokens() {
    this.tokens = {};
    localStorage.removeItem('admin_token');
    localStorage.removeItem('content_token');
  }

  loadTokensFromStorage() {
    const adminToken = localStorage.getItem('admin_token');
    const contentToken = localStorage.getItem('content_token');
    
    if (adminToken) this.tokens.adminToken = adminToken;
    if (contentToken) this.tokens.contentToken = contentToken;
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  // For multipart form data (file uploads)
  async postForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async putForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Create API client instance
const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000, // 30 seconds
};

export const apiClient = new ApiClient(apiConfig);

// Load tokens on initialization
apiClient.loadTokensFromStorage();

export default apiClient;