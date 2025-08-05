import {apiClient} from './api.config';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from './api.types';
import {AxiosError} from "axios";
import {useAuthStore} from "../store/auth.store.ts";

export class AuthService {
  static async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse, LoginRequest>('/admin/login', credentials);

      if (response.data?.accessToken) {
        apiClient.setAccessToken(response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Admin login failed');
      }
      throw error;
    }
  }

  static async adminRegister(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse, RegisterRequest>('/admin/register', userData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Admin registration failed');
      }
      throw error;
    }
  }


  static async contentManagerLogin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse, LoginRequest>('/content-manager/login', credentials);

      if (response.data?.accessToken) {
        apiClient.setAccessToken(response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Content manager login failed');
      }
      throw error;
    }
  }

  static async contentManagerRegister(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse, RegisterRequest>('/content-manager/register', userData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Content manager registration failed');
      }
      throw error;
    }
  }

  static logout() {
    useAuthStore.setState((state) => ({
      ...state,
      accessToken: null,
      role: null,
      isAuthenticated: false,
    }))
  }
}

export const {
  adminLogin,
  adminRegister,
  contentManagerLogin,
  contentManagerRegister,
  logout,
} = AuthService;