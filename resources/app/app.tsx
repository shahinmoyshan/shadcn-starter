import "./app.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Router from "./router";
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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AppProvider>
            <Router />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
