import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, getMeAPI } from "@/services/authService";
import { getToken, getUser, logout } from "@/lib/auth";

// Context
const AuthContext = createContext(null);

//  Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // App load pe user verify karo
  useEffect(() => {
    const verify = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      if (!navigator.onLine) {
        console.log("Offline - using cached user");
        setLoading(false);
        return; // getUser() se already set hai
      }

      try {
        const res = await getMeAPI();
        setUser(res.data);
      } catch (err) {
        if (err?.isNetworkError) {
          console.log("Network error — keeping session");
          setLoading(false);
          return;
        }
        // Token invalid  - logout
        logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await loginAPI(email, password);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    // Role ke hisaab se redirect
    const ROLE_ROUTES = {
      RECEPTIONIST: "/receptionist",
      DOCTOR: "/doctor",
      ADMIN: "/admin",
    };

    navigate(ROLE_ROUTES[res.data.user.role] || "/login");
    return res.data;
  };

  // Logout
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout: handleLogout,
        isAuthenticated: !!user,
        isDoctor: user?.role === "DOCTOR",
        isReceptionist: user?.role === "RECEPTIONIST",
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};
