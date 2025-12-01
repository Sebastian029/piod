import React, { createContext, useContext, useState, useEffect } from "react";
import { type User, MealPlanApi } from "../../api";


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
        const tokenRes = await MealPlanApi.auth.tokenCreate({ username, password });
        setToken(tokenRes.data.access);
        localStorage.setItem("token", tokenRes.data.access);

        const userRes = await MealPlanApi.user.userRetrieve()
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));
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
        await MealPlanApi.auth.authRegisterCreate({ username, email, password });
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
