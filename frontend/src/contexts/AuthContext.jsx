import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

// Create auth context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => {},
  updateProfile: () => {},
  loading: true,
  error: null,
});

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Helper: Load user from localStorage
const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(loadUserFromStorage());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from backend + merge local changes
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await authAPI.getProfile();
          const storedUser = loadUserFromStorage();

          const mergedUser = {
            ...data,
            ...(storedUser?.photoURL ? { photoURL: storedUser.photoURL } : {}),
            ...(storedUser?.email ? { email: storedUser.email } : {}),
            originalEmail: data.email, // backend email
          };

          setUser(mergedUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(mergedUser));
        } catch (err) {
          console.error("Failed to load user", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setError("Your session has expired. Please login again.");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = loadUserFromStorage();
      // use original backend email for auth
      const backendEmail = storedUser?.originalEmail || email;

      const { data } = await authAPI.login({ email: backendEmail, password });

      const mergedUser = {
        ...(data.user || data),
        ...(storedUser?.photoURL ? { photoURL: storedUser.photoURL } : {}),
        email: storedUser?.email || (data.user?.email || data.email), // use fake email
        originalEmail: data.user?.email || data.email,
      };

      setUser(mergedUser);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.register({ name, email, password });

      const storedUser = loadUserFromStorage();

      const mergedUser = {
        ...(data.user || data),
        ...(storedUser?.photoURL ? { photoURL: storedUser.photoURL } : {}),
        email: storedUser?.email || email,
        originalEmail: data.user?.email || data.email,
      };

      setUser(mergedUser);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Update profile
  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      if (!prev.originalEmail) newUser.originalEmail = prev.email; // preserve backend email
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, updateProfile, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
