import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { FaHeartbeat } from "react-icons/fa";

import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Lazy-loaded Pages
const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ReceptionistPage = lazy(
  () => import("@/pages/receptionist/ReceptionistPage"),
);
const DoctorPage = lazy(() => import("@/pages/doctor/DoctorPage"));
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));

// Loading Component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <FaHeartbeat className="h-14 w-14 animate-pulse text-primary" />
      <p className="text-sm font-medium text-muted-foreground">
        Loading Hospital System...
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Receptionist */}
            <Route
              path="/receptionist"
              element={
                <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
                  <ReceptionistPage />
                </ProtectedRoute>
              }
            />

            {/* Doctor */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorPage />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
