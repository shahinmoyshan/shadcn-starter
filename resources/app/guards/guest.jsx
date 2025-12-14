import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/auth";

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    // Redirect to the page they were trying to access, or dashboard
    const from = location.state?.from?.pathname || CONFIG.dashboard_root || "/";
    return <Navigate to={from} replace />;
  }

  return children;
}
