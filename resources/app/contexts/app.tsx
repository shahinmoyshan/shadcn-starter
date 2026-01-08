import { createContext, useContext, useMemo, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  Users,
  CircleGauge,
  Database,
  FileText,
  HelpCircle,
  FileBarChart,
  Settings,
  Brain,
} from "lucide-react";
import { useAuth } from "./auth";
import type {
  AppContextValue,
  MenuItem,
  Menu,
  CurrentMenu,
} from "@/types/context";

export const AppContext = createContext<AppContextValue | null>(null);

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { canAny } = useAuth();

  const filterMenuItemsByPermissions = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems
      .filter((item) => !item.permission || canAny(item.permission))
      .map((item) => {
        if (item.items) {
          const filteredSubmenu = item.items.filter(
            (sub) => !sub.permission || canAny(sub.permission)
          );
          return { ...item, items: filteredSubmenu };
        }
        return item;
      });
  };

  const menu: Menu = {
    navMain: filterMenuItemsByPermissions([
      {
        title: "Dashboard",
        url: "/",
        icon: CircleGauge,
        permission: ["dashboard.overview"],
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
        permission: ["users.browse"],
      },
      {
        title: "Models",
        icon: Brain,
        items: [
          {
            title: "Genesis",
            url: "/models/genesis",
          },
          {
            title: "Explorer",
            url: "/models/explorer",
          },
          {
            title: "Quantum",
            url: "/models/quantum",
          },
        ],
      },
    ]),
    navSecondary: filterMenuItemsByPermissions([
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        permission: ["settings.general"],
      },
      {
        title: "Get Help",
        url: "/help",
        icon: HelpCircle,
      },
    ]),
    documents: [
      {
        name: "Data Library",
        url: "/documents/data-library",
        icon: Database,
      },
      {
        name: "Reports",
        url: "/documents/reports",
        icon: FileBarChart,
      },
      {
        name: "Word Assistant",
        url: "/documents/word-assistant",
        icon: FileText,
      },
    ],
    hidden: [
      {
        title: "Profile",
        url: "/profile",
      },
      {
        title: "Order Details",
        url: "/order/:id",
      },
    ],
  };

  const currentMenu: CurrentMenu = useMemo(() => {
    const path = location.pathname;

    // Check main nav items
    for (const item of menu.navMain || []) {
      if (item.url === path) {
        return { title: item.title, url: item.url, icon: item.icon || null };
      }
      // Check sub items
      if (item.items) {
        for (const subItem of item.items) {
          if (subItem.url === path) {
            return {
              title: subItem.title,
              url: subItem.url,
              icon: item.icon || null,
            };
          }
        }
      }
    }

    // Check documents
    for (const item of menu.documents || []) {
      if (item.url === path) {
        return { title: item.name, url: item.url, icon: item.icon };
      }
    }

    // Check secondary nav
    for (const item of menu.navSecondary || []) {
      if (item.url === path) {
        return { title: item.title, url: item.url, icon: item.icon || null };
      }
    }

    // Check hidden nav
    for (const item of menu.hidden || []) {
      if (
        item.url === path ||
        (item.url &&
          item.url.includes(":") &&
          path.startsWith(item.url.split("/:")[0] || ""))
      ) {
        return {
          title: item.title,
          url: item.url || "/",
          icon: item.icon || null,
        };
      }
    }

    // Default to Dashboard
    return {
      title: "Dashboard",
      url: "/",
      icon: CircleGauge,
    };
  }, [location.pathname, menu]);

  const getFirstPermittedMenuItem = (): string | null => {
    const allMenuItems = [...menu.navMain, ...(menu.navSecondary || [])];
    for (const item of allMenuItems) {
      if (!item.permission || canAny(item.permission)) {
        if (item.items) {
          for (const subItem of item.items) {
            if (
              subItem.url &&
              (!subItem.permission || canAny(subItem.permission))
            ) {
              return subItem.url;
            }
          }
        }

        if (item.url) return item.url;
      }
    }
    return null; // No permitted menu item found
  };

  const redirectToFirstPermittedMenuItem = (): boolean | void => {
    const firstPermittedMenuItem = getFirstPermittedMenuItem();
    if (firstPermittedMenuItem) {
      navigate(firstPermittedMenuItem);
      return;
    }
    return false;
  };

  // Context value to be provided to children components
  const value: AppContextValue = {
    menu,
    currentMenu,
    redirectToFirstMenu: redirectToFirstPermittedMenuItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
