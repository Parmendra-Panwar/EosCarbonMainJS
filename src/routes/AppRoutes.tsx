import { Routes, Route } from "react-router";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleGuard from "./RoleGuard";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Unauthorized from "../pages/Unauthorized";

import DashboardLayout from "../components/layout/DashboardLayout";

import GovernmentDashboard from "../pages/dashboard/government/GovernmentDashboard";
import NgoDashboard from "../pages/dashboard/ngo/NgoDashboard";
import FarmerDashboard from "../pages/dashboard/farmer/FarmerDashboard";
import CompanyDashboard from "../pages/dashboard/company/CompanyDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="government"
          element={
            <RoleGuard allowedRoles={["government"]}>
              <GovernmentDashboard />
            </RoleGuard>
          }
        />

        <Route
          path="ngo"
          element={
            <RoleGuard allowedRoles={["ngo"]}>
              <NgoDashboard />
            </RoleGuard>
          }
        />

        <Route
          path="farmer"
          element={
            <RoleGuard allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </RoleGuard>
          }
        />

        <Route
          path="company"
          element={
            <RoleGuard allowedRoles={["company"]}>
              <CompanyDashboard />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}
