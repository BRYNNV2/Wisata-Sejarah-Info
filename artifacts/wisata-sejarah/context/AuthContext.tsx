import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "admin" | "pengunjung";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const ACCOUNTS: { username: string; password: string; user: User }[] = [
  {
    username: "admin",
    password: "admin123",
    user: {
      id: "1",
      username: "admin",
      name: "Administrator",
      role: "admin",
      email: "admin@wisatasejarah.id",
    },
  },
  {
    username: "pengunjung",
    password: "kunjungi",
    user: {
      id: "2",
      username: "pengunjung",
      name: "Pengunjung Umum",
      role: "pengunjung",
      email: "pengunjung@wisatasejarah.id",
    },
  },
  {
    username: "budi",
    password: "budi123",
    user: {
      id: "3",
      username: "budi",
      name: "Budi Santoso",
      role: "pengunjung",
      email: "budi@email.com",
    },
  },
];

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_STORAGE_KEY = "wisata_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const account = ACCOUNTS.find(
      (a) => a.username.toLowerCase() === username.toLowerCase() && a.password === password
    );
    if (!account) {
      return { success: false, error: "Username atau password salah" };
    }
    setUser(account.user);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account.user));
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
