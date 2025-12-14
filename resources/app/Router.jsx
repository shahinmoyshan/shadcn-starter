import { Route, Routes, Navigate } from "react-router";

import ProtectedRoute from "./guards/authenticated";
import GuestRoute from "./guards/guest";
import DashboardLayout from "./layouts/dashboard";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";

const Router = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default Router;
