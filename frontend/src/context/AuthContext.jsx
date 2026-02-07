import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await AuthAPI.me();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const handleAuthSuccess = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  };

  const login = async (credentials) => {
    const { data } = await AuthAPI.login(credentials);
    handleAuthSuccess(data);
  };

  const register = async (payload) => {
    const { data } = await AuthAPI.register(payload);
    handleAuthSuccess(data);
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    logout: handleLogout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};