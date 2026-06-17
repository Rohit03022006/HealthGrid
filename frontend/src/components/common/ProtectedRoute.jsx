import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat } from "react-icons/fa";

import { useAuth } from "@/hooks/useAuth.jsx";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.45, 0.15, 0.45],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-primary/20"
            />

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-2 rounded-full border-2 border-primary/20 border-t-primary"
            />

            <motion.div
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
            >
              <FaHeartbeat className="h-8 w-8 text-primary" />
            </motion.div>
          </div>

          <motion.p
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-sm font-medium text-muted-foreground"
          >
            Loading Hospital System...
          </motion.p>
        </motion.div>
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