/**
 * TanStack Query hooks and configuration
 * Centralized query keys and hooks for data fetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profile, users } from "@/lib/api";
import { queryKeys } from "@/lib/consts";

/**
 * Factory for list queries with pagination and search
 */
export function makeListQuery(queryKeyFn, apiFn, options = {}) {
  return function useList(params = {}) {
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

/**
 * Factory for create mutations
 */
export function makeCreateMutation(api, invalidateKeyFn, entityName) {
  return function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data) => api.create(data),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: invalidateKeyFn() });
        toast.success(
          response.data.message || `${entityName} created successfully`
        );
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || `Failed to create ${entityName}`
        );
      },
    });
  };
}

/**
 * Factory for update mutations
 */
export function makeUpdateMutation(api, invalidateKeyFn, entityName) {
  return function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }) => api.update(id, data),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: invalidateKeyFn() });
        toast.success(
          response.data.message || `${entityName} updated successfully`
        );
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || `Failed to update ${entityName}`
        );
      },
    });
  };
}

/**
 * Factory for delete mutations - Simplified without optimistic updates
 */
export function makeDeleteMutation(api, invalidateKeyFn, entityName) {
  return function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id) => api.delete(id),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: invalidateKeyFn() });
        toast.success(
          response.data.message || `${entityName} deleted successfully`
        );
      },
      onError: (error) => {
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
 * @param {Object} params - Query parameters (page, per_page, search)
 */
export const useUsers = makeListQuery(queryKeys.users.list, users.index);

export const useCreateUsers = makeCreateMutation(
  users,
  queryKeys.users.lists,
  "User"
);

export const useUpdateUsers = makeUpdateMutation(
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
export function useUpdateProfile(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => profile.updateGeneral(data),
    onSuccess: (response) => {
      // Update user in cache if provided
      if (response.data.user) {
        queryClient.setQueryData(queryKeys.auth.user, response.data.user);
      }
      toast.success(response.data.message || "Profile updated successfully");
    },
    ...options,
  });
}

/**
 * Update user password mutation
 */
export function useUpdatePassword(options = {}) {
  return useMutation({
    mutationFn: (data) => profile.updatePassword(data),
    onSuccess: (response) => {
      toast.success(response.data.message || "Password updated successfully");
    },
    ...options,
  });
}
