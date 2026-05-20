import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const users = [
  { username: "vinicius", password: "1123202" },
  { username: "L0022-GER-01", password: "123" },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("crm_user");
    return stored ? JSON.parse(stored) : null;
  });

  function login(username: string, password: string): boolean {
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return false;
    const userData: User = { username: found.username };
    setUser(userData);
    sessionStorage.setItem("crm_user", JSON.stringify(userData));
    return true;
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("crm_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
