import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import {useAuthStore} from "../store/auth.store.ts";

export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

interface QueueItem {
  resolve: () => void;
  reject: (error: Error) => void;
}

class ApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly refreshInstance: AxiosInstance;
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

        if (useAuthStore.getState().accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: Error & { response?: { status: number }, config?: AxiosRequestConfig & { _retry?: boolean } }) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise<void>((resolve, reject) => {
              this.refreshQueue.push({resolve, reject});
            }).then(() => this.axiosInstance(originalRequest));
          }

          this.isRefreshing = true;
          try {
            useAuthStore.setState({accessToken: await this.refreshAccessToken()});

            this.refreshQueue.forEach(({resolve}) => resolve());
            this.refreshQueue = [];

            if (originalRequest) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
              return this.axiosInstance(originalRequest);
            }

          } catch (refreshError) {
            useAuthStore.getState().logout();
            this.refreshQueue.forEach(({reject}) => reject(refreshError as Error));
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
    const response = await this.refreshInstance.post<{
      accessToken: string
    }>('/auth/refresh');
    const newToken = response.data?.accessToken;
    if (!newToken) {
      throw new Error('Не удалось получить новый access token');
    }
    return newToken;
  }

  setAccessToken(token: string) {
    useAuthStore.setState({accessToken: token});
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