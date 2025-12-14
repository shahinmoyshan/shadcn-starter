import "./app.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import axios from "axios";
import Router from "./Router";
import { AppProvider } from "./contexts/app";
import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Configure axios defaults
axios.defaults.baseURL = CONFIG.api_base_url;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
