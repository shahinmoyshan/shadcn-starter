import type { LucideIcon } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApiResponse, LoginResponse } from "./api";

// Auth Context Types
export interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  login: UseMutationResult<
    ApiResponse<LoginResponse>,
    AxiosError<ApiResponse>,
    LoginCredentials,
    unknown
  >;
  logout: UseMutationResult<
    ApiResponse,
    AxiosError<ApiResponse>,
    void,
    unknown
  >;
  isAuthenticated: () => boolean;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  cannot: (permission: string) => boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface LoginCredentials {
  user: string;
  password: string;
  remember_me?: boolean;
}

// App Context Types
export interface MenuItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  permission?: string[];
  items?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  url: string;
  permission?: string[];
}

export interface DocumentItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface Menu {
  navMain: MenuItem[];
  navSecondary: MenuItem[];
  documents: DocumentItem[];
  hidden: MenuItem[];
}

export interface CurrentMenu {
  title: string;
  url: string;
  icon: LucideIcon | null;
}

export interface AppContextValue {
  menu: Menu;
  currentMenu: CurrentMenu;
  redirectToFirstMenu: () => boolean | void;
}
