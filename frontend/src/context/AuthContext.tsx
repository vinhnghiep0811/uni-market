"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { getMe, logout } from "@/lib/auth";
import { AuthUser } from "@/types/auth";
import { apiRequest, setAccessToken } from "@/lib/api";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  setCurrentUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  const fetchMe = async () => {
    const requestId = ++requestIdRef.current;

    try {
      try {
        const me = await getMe();
        if (requestId === requestIdRef.current) {
          setUser(me);
        }
        return;
      } catch {}

      try {
        const res = await apiRequest<{ accessToken: string }>("/auth/refresh", {
          method: "POST",
        });

        setAccessToken(res.accessToken);

        const me = await getMe();
        if (requestId === requestIdRef.current) {
          setUser(me);
        }
      } catch {
        if (requestId === requestIdRef.current) {
          setUser(null);
        }
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchMe();
  }, []);

  const refreshUser = async () => {
    await fetchMe();
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setIsLoading(false);
  };
  
  const setCurrentUser = (nextUser: AuthUser | null) => {
    console.log("setCurrentUser", nextUser);
    requestIdRef.current += 1;
    setUser(nextUser);
    setIsLoading(false);
  };  

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refreshUser, logoutUser, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
