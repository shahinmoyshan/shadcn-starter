import { createContext, useContext, useMemo } from "react";
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

export const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { canAny } = useAuth();

  const filterMenuItemsByPermissions = (menuItems) => {
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

  const menu = {
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
        icon: null,
      },
      {
        title: "Order Details",
        url: "/order/:id",
        icon: null,
      },
    ],
  };

  const currentMenu = useMemo(() => {
    const path = location.pathname;

    // Check main nav items
    for (const item of menu.navMain || []) {
      if (item.url === path) {
        return { title: item.title, url: item.url, icon: item.icon };
      }
      // Check sub items
      if (item.items) {
        for (const subItem of item.items) {
          if (subItem.url === path) {
            return { title: subItem.title, url: subItem.url, icon: item.icon };
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
        return { title: item.title, url: item.url, icon: item.icon };
      }
    }

    // Check hidden nav
    for (const item of menu.hidden || []) {
      if (
        item.url === path ||
        (item.url.includes(":") && path.startsWith(item.url.split("/:")[0]))
      ) {
        return { title: item.title, url: item.url, icon: item.icon };
      }
    }

    // Default to Dashboard
    return {
      title: "Dashboard",
      url: "/",
      icon: CircleGauge,
    };
  }, [location.pathname]);

  const getFirstPermittedMenuItem = () => {
    const allMenuItems = [...menu.navMain, ...menu.navSecondary];
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

  const redirectToFirstPermittedMenuItem = () => {
    const firstPermittedMenuItem = getFirstPermittedMenuItem();
    if (firstPermittedMenuItem) {
      navigate(firstPermittedMenuItem);
      return;
    }
    return false;
  };

  // Context value to be provided to children components
  const value = {
    menu,
    currentMenu,
    redirectToFirstMenu: redirectToFirstPermittedMenuItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
