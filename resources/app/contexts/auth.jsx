import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { auth } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => CONFIG.user || null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: async ({ user, password, remember_me = false }) => {
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

  const logout = useMutation({
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

  const isAuthenticated = () => {
    return user && user.id > 0;
  };

  const can = (permission) => {
    if (!isAuthenticated()) return false;
    return user.privileges && user.privileges.includes(permission);
  };

  const canAny = (permissions) => {
    if (!isAuthenticated()) return false;
    return permissions.some(
      (permission) => user.privileges && user.privileges.includes(permission)
    );
  };

  const cannot = (permission) => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
