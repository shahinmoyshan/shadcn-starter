import axios, { AxiosResponse } from "axios";
import type {
  ApiResponse,
  PaginatedResponse,
  LoginCredentials,
  AuthResponse,
  UserListParams,
  UserFormData,
  UserUpdateData,
  ProfileUpdateData,
  PasswordUpdateData,
} from "@/types/api";

// Configure axios defaults
axios.defaults.baseURL = CONFIG.api_base_url;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Profile API endpoints
export const profile = {
  updateGeneral: (
    data: ProfileUpdateData
  ): Promise<AxiosResponse<ApiResponse<User>>> =>
    axios.post("/profile", { ...data, action: "general" }),

  updatePassword: (
    data: PasswordUpdateData
  ): Promise<AxiosResponse<ApiResponse>> =>
    axios.post("/profile", { ...data, action: "password" }),
};

// Auth API endpoints
export const auth = {
  login: (
    data: LoginCredentials
  ): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    axios.post("/auth/login", data),

  logout: (): Promise<AxiosResponse<ApiResponse>> => axios.post("/auth/logout"),
};

// Users API endpoints
export const users = {
  index: (
    params?: UserListParams
  ): Promise<AxiosResponse<ApiResponse<PaginatedResponse<User>>>> =>
    axios.get("/users", { params }),

  create: (data: UserFormData): Promise<AxiosResponse<ApiResponse<User>>> =>
    axios.post("/users", data),

  update: (
    id: number,
    data: UserUpdateData
  ): Promise<AxiosResponse<ApiResponse<User>>> =>
    axios.put(`/users/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    axios.delete(`/users/${id}`),
};
