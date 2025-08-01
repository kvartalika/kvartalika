import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

interface QueueItem {
  resolve: () => void;
  reject: (err: any) => void;
}

class ApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly refreshInstance: AxiosInstance;
  private accessToken: string | null = null;
  private isRefreshing = false;
  private refreshQueue: QueueItem[] = [];

  constructor(config: ApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.refreshInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise<void>((resolve, reject) => {
              this.refreshQueue.push({resolve, reject});
            }).then(() => this.axiosInstance(originalRequest));
          }

          this.isRefreshing = true;
          try {
            this.accessToken = await this.refreshAccessToken();

            this.refreshQueue.forEach(({resolve}) => resolve());
            this.refreshQueue = [];

            originalRequest.headers = originalRequest.headers || {};

            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.axiosInstance(originalRequest);

          } catch (refreshError) {
            this.clearTokens();
            this.refreshQueue.forEach(({reject}) => reject(refreshError));
            this.refreshQueue = [];
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    // POST без тела, сервер возьмёт refresh-token из HttpOnly cookie
    const response = await this.refreshInstance.post<{
      accessToken: string
    }>('/auth/refresh');
    const newToken = response.data?.accessToken;
    if (!newToken) {
      throw new Error('Не удалось получить новый access token');
    }
    return newToken;
  }

  /** Устанавливаем access-token после логина */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  clearTokens() {
    this.accessToken = null;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<TResponse, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.axiosInstance.post<TResponse>(url, data, config);
  }

  async put<TResponse, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.axiosInstance.put<TResponse>(url, data, config);
  }


  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  async postForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async putForm<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
};

export const apiClient = new ApiClient(apiConfig);