import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/auth";
import { route } from "@/lib/utils";

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    // Redirect to the page they were trying to access, or dashboard
    const from = location.state?.from?.pathname || route();
    return <Navigate to={from} replace />;
  }

  return children;
}
