/**
 * AuthContext — Single source of truth for the current user session.
 * 
 * - Fetches user once on app load from /auth/me
 * - Provides login(), logout(), and the user object to any component
 * - When login() is called, it stores the token AND updates the user state immediately
 *   (no page reload needed — the navbar updates instantly)
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until first fetch completes

  // Fetch the currently logged-in user on initial app load
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      // Fast path: if no token in localStorage, skip the network call
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) setUser(res.data);
      } catch {
        // Token may be expired — clear it
        localStorage.removeItem("token");
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, []);

  /**
   * Call after a successful login API response.
   * Stores the token, sets the user immediately so navbar updates without any reload.
   */
  const login = useCallback(async (token) => {
    localStorage.setItem("token", token);
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      // Fallback: decode basic info from token payload if /auth/me fails
      setUser({ email: "user" });
    }
  }, []);

  /**
   * Call on logout — clears token, clears user state.
   * Navbar will reactively switch back to "Sign In" button.
   */
  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Even if logout endpoint fails, clear locally
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
