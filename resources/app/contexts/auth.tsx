import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { auth } from "@/lib/api";
import type { ApiResponse, LoginResponse } from "@/types/api";

interface LoginCredentials {
  user: string;
  password: string;
  remember_me?: boolean;
}

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  login: UseMutationResult<
    ApiResponse<LoginResponse>,
    AxiosError<ApiResponse>,
    LoginCredentials
  >;
  logout: UseMutationResult<ApiResponse, AxiosError<ApiResponse>, void>;
  isAuthenticated: () => boolean;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  cannot: (permission: string) => boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => CONFIG.user || null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ApiResponse>,
    LoginCredentials
  >({
    mutationFn: async ({ user, password, remember_me = false }: LoginCredentials) => {
      const response = await auth.login({
        username: user,
        password,
        remember: remember_me,
      });
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      }
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const logout = useMutation<ApiResponse, AxiosError<ApiResponse>, void>({
    mutationFn: async () => {
      const response = await auth.logout();
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setUser(null);
      navigate("/login");
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const isAuthenticated = (): boolean => {
    return !!user && user.id > 0;
  };

  const can = (permission: string): boolean => {
    if (!isAuthenticated()) return false;
    return user?.privileges ? user.privileges.includes(permission) : false;
  };

  const canAny = (permissions: string[]): boolean => {
    if (!isAuthenticated()) return false;
    return permissions.some(
      (permission) => user?.privileges ? user.privileges.includes(permission) : false
    );
  };

  const cannot = (permission: string): boolean => {
    return !can(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated,
        can,
        canAny,
        cannot,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
