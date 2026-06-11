
import { Navigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth.jsx";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <FaHeartbeat className="h-14 w-14 animate-pulse text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading Hospital System...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
