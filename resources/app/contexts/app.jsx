import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router";

import {
  CircleGauge,
  Database,
  FileText,
  HelpCircle,
  FileBarChart,
  Settings,
  Brain,
} from "lucide-react";

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

  const menu = {
    navMain: [
      {
        title: "Dashboard",
        url: "/",
        icon: CircleGauge,
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
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Get Help",
        url: "/help",
        icon: HelpCircle,
      },
    ],
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

    // Default to Dashboard
    return {
      title: "Dashboard",
      url: "/",
      icon: CircleGauge,
    };
  }, [location.pathname]);

  // Context value to be provided to children components
  const value = {
    menu,
    currentMenu,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
