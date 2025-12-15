import { Route, Routes } from "react-router";

import ProtectedRoute from "./guards/authenticated";
import GuestRoute from "./guards/guest";
import DashboardLayout from "./layouts/dashboard";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";

const Router = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={route("login")}
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
        path={route()}
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default Router;
