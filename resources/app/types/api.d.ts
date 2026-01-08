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
  links: T[];
  pages: number;
  page: number;
  offset: number;
  limit: number;
  first_item: number;
  last_item: number;
  total: number;
  keyword: number;
}

// Auth API types
export interface LoginCredentials {
  user: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  errors?: Record<string, string[]>;
}

// User API types
export interface UserListParams {
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
