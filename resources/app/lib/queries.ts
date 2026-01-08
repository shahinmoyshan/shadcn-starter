/**
 * TanStack Query hooks and configuration
 * Centralized query keys and hooks for data fetching
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { toast } from "sonner";
import { profile, users } from "@/lib/api";
import { queryKeys } from "@/lib/consts";
import type {
  ApiResponse,
  PaginatedResponse,
  UserListParams,
  UserFormData,
  UserUpdateData,
  ProfileUpdateData,
  PasswordUpdateData,
  AuthResponse,
} from "@/types/api";

/**
 * Factory for list queries with pagination and search
 */
export function makeListQuery<TData, TParams = unknown>(
  queryKeyFn: (params: TParams) => QueryKey,
  apiFn: (params: TParams) => Promise<AxiosResponse<ApiResponse<TData>>>,
  options: Omit<
    UseQueryOptions<ApiResponse<TData>, AxiosError, ApiResponse<TData>>,
    "queryKey" | "queryFn"
  > = {}
) {
  return function useList(params = {} as TParams) {
    return useQuery({
      queryKey: queryKeyFn(params),
      queryFn: async () => {
        const response = await apiFn(params);
        return response.data;
      },
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      ...options,
    });
  };
}

interface CreateApi<TData, TFormData> {
  create: (data: TFormData) => Promise<AxiosResponse<ApiResponse<TData>>>;
}

/**
 * Factory for create mutations
 */
export function makeCreateMutation<TData, TFormData>(
  api: CreateApi<TData, TFormData>,
  invalidateKeyFn: () => QueryKey,
  entityName: string
) {
  return function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TFormData) => api.create(data),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: invalidateKeyFn() });
        toast.success(
          response.data.message || `${entityName} created successfully`
        );
      },
      onError: (error: AxiosError<ApiResponse>) => {
        toast.error(
          error.response?.data?.message || `Failed to create ${entityName}`
        );
      },
    });
  };
}

interface UpdateApi<TData, TUpdateData> {
  update: (
    id: number,
    data: TUpdateData
  ) => Promise<AxiosResponse<ApiResponse<TData>>>;
}

/**
 * Factory for update mutations
 */
export function makeUpdateMutation<TData, TUpdateData>(
  api: UpdateApi<TData, TUpdateData>,
  invalidateKeyFn: () => QueryKey,
  entityName: string
) {
  return function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: TUpdateData }) =>
        api.update(id, data),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: invalidateKeyFn() });
        toast.success(
          response.data.message || `${entityName} updated successfully`
        );
      },
      onError: (error: AxiosError<ApiResponse>) => {
        toast.error(
          error.response?.data?.message || `Failed to update ${entityName}`
        );
      },
    });
  };
}

interface DeleteApi {
  delete: (id: number) => Promise<AxiosResponse<ApiResponse>>;
}

/**
 * Factory for delete mutations - Simplified without optimistic updates
 */
export function makeDeleteMutation(
  api: DeleteApi,
  invalidateKeyFn: () => QueryKey,
  entityName: string
) {
  return function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => api.delete(id),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: invalidateKeyFn() });
        toast.success(
          response.data.message || `${entityName} deleted successfully`
        );
      },
      onError: (error: AxiosError<ApiResponse>) => {
        toast.error(
          error.response?.data?.message || `Failed to delete ${entityName}`
        );
      },
    });
  };
}

// Users Hooks

/**
 * Fetch paginated users with search
 * @param params - Query parameters (page, per_page, search)
 */
export const useUsers = makeListQuery<PaginatedResponse<User>, UserListParams>(
  queryKeys.users.list,
  users.index
);

export const useCreateUsers = makeCreateMutation<User, UserFormData>(
  users,
  queryKeys.users.lists,
  "User"
);

export const useUpdateUsers = makeUpdateMutation<User, UserUpdateData>(
  users,
  queryKeys.users.lists,
  "User"
);

export const useDeleteUsers = makeDeleteMutation(
  users,
  queryKeys.users.lists,
  "User"
);

/**
 * Update user general information mutation
 */
export function useUpdateProfile(
  options: Omit<
    UseMutationOptions<
      AxiosResponse<AuthResponse>,
      AxiosError<ApiResponse>,
      ProfileUpdateData
    >,
    "mutationFn"
  > = {}
) {
  return useMutation({
    mutationFn: (data: ProfileUpdateData) => profile.updateGeneral(data),
    onSuccess: (response) => {
      toast.success(response.data.message || "Profile updated successfully");
    },
    ...options,
  });
}

/**
 * Update user password mutation
 */
export function useUpdatePassword(
  options: Omit<
    UseMutationOptions<
      AxiosResponse<ApiResponse>,
      AxiosError<ApiResponse>,
      PasswordUpdateData
    >,
    "mutationFn"
  > = {}
) {
  return useMutation({
    mutationFn: (data: PasswordUpdateData) => profile.updatePassword(data),
    onSuccess: (response) => {
      toast.success(response.data.message || "Password updated successfully");
    },
    ...options,
  });
}
