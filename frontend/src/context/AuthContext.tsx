"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { getMe, logout } from "@/lib/auth";
import { AuthUser } from "@/types/auth";

type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const me = await getMe();
            setUser(me);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    const refreshUser = async () => {
        setIsLoading(true);
        await fetchMe();
    };

    const logoutUser = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, refreshUser, logoutUser }}
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