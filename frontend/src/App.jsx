import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import logo from "@/assets/logo.png";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Lazy-loaded Pages
const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ReceptionistPage = lazy(
  () => import("@/pages/receptionist/ReceptionistPage"),
);
const DoctorPage = lazy(() => import("@/pages/doctor/DoctorPage"));
import TemplateManagerPage from "@/pages/doctor/TemplateManagerPage";

const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));

// Loading Component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <img
        src={logo}
        alt="HealthGrid logo"
        className="h-16 w-16 animate-pulse rounded-xl object-contain"
      />

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
            <Route
              path="/doctor/templates"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <TemplateManagerPage />
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
