import { AxiosResponse } from "axios";

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// Auth API types
export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

// User API types
export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  privileges?: string[];
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  privileges?: string[];
}

// Profile API types
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
}

export interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// API client interface
export interface ApiClient {
  profile: {
    get: () => Promise<AxiosResponse<ApiResponse<User>>>;
    update: (data: ProfileUpdateData) => Promise<AxiosResponse<ApiResponse<User>>>;
    updatePassword: (data: PasswordUpdateData) => Promise<AxiosResponse<ApiResponse>>;
  };
  auth: {
    login: (credentials: LoginCredentials) => Promise<AxiosResponse<ApiResponse<LoginResponse>>>;
    logout: () => Promise<AxiosResponse<ApiResponse>>;
  };
  users: {
    list: (params?: UserListParams) => Promise<AxiosResponse<ApiResponse<PaginatedResponse<User>>>>;
    store: (data: UserFormData) => Promise<AxiosResponse<ApiResponse<User>>>;
    update: (id: number, data: UserUpdateData) => Promise<AxiosResponse<ApiResponse<User>>>;
    destroy: (id: number) => Promise<AxiosResponse<ApiResponse>>;
  };
}
