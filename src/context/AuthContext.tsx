"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    getMeRequest,
    loginRequest,
    logoutRequest,
    User,
} from "@/services/auth.service";
import { tokenStorage } from "@/lib/token";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    refreshUser: () => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        const access = tokenStorage.getAccess();

        if (!access) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const data = await getMeRequest();
            setUser(data);
        } catch {
            tokenStorage.clear();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        setLoading(true);

        try {
            const user = await loginRequest(email, password);
            setUser(user);
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        logoutRequest();
        setUser(null);
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
