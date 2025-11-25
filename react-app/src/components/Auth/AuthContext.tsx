import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

type User = {
  username: string;
  email: string;
};
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (data: {username: string, password: string}) => Promise<boolean>;
  logout: () => void;
  register: (data: {username: string, email: string, password: string}) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async ({ username, password }: {username: string, password: string}) => {
    try {
        const res = await axiosInstance.post("/api/token/", { username, password });
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const register = async ({username, email, password}: {username: string, email: string, password: string}) => {
    try {
        const res = await axiosInstance.post("/api/auth/register/", { username, email, password });
        return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
