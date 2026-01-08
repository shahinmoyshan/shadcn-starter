import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { auth } from "@/lib/api";
import type { ApiResponse, LoginCredentials, AuthResponse } from "@/types/api";
import { AuthContextValue } from "@/types/context";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => CONFIG.user || null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useMutation<
    AuthResponse,
    AxiosError<ApiResponse>,
    LoginCredentials
  >({
    mutationFn: async ({
      user,
      password,
      remember_me = false,
    }: LoginCredentials) => {
      const response = await auth.login({
        user,
        password,
        remember_me,
      });
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser(data.user);
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
    if (!isAuthenticated() || !user?.privileges) return false;
    return user.privileges.includes(permission);
  };

  const canAny = (permissions: string[]): boolean => {
    if (!isAuthenticated() || !user?.privileges) return false;
    return permissions.some(
      (permission) => user.privileges && user.privileges.includes(permission)
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
