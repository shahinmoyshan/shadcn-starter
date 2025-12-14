import { createContext, useContext } from "react";

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

  const currentMenu = () => {
    return {
      title: "Dashboard",
      url: "/",
      icon: CircleGauge,
    };
  };

  // Context value to be provided to children components
  const value = {
    menu,
    currentMenu,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
