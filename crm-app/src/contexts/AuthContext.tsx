import { createContext, useContext, useState, type ReactNode } from "react";

interface StoredUser {
  username: string;
  password: string;
  name: string;
  role: string;
}

interface User {
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  users: StoredUser[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (name: string, role: string) => void;
  changePassword: (current: string, newPass: string) => boolean;
  addUser: (username: string, password: string, name: string, role: string) => boolean;
  removeUser: (username: string) => void;
}

const defaultUsers = [
  { username: "vinicius", password: "1123202", name: "Vinicius", role: "Administrador" },
  { username: "L0022-GER-01", password: "123", name: "L0022", role: "Gerente de Vendas" },
];

function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem("crm_users");
    return stored ? JSON.parse(stored) : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>(loadUsers);
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("crm_user");
    return stored ? JSON.parse(stored) : null;
  });

  function saveUsers(users: StoredUser[]) {
    localStorage.setItem("crm_users", JSON.stringify(users));
    setStoredUsers(users);
  }

  function login(username: string, password: string): boolean {
    const found = storedUsers.find((u) => u.username === username && u.password === password);
    if (!found) return false;
    const userData: User = { username: found.username, name: found.name, role: found.role };
    setUser(userData);
    sessionStorage.setItem("crm_user", JSON.stringify(userData));
    return true;
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("crm_user");
  }

  function updateProfile(name: string, role: string) {
    if (!user) return;
    const updated = { ...user, name, role };
    setUser(updated);
    sessionStorage.setItem("crm_user", JSON.stringify(updated));
    setStoredUsers((prev) => prev.map((u) =>
      u.username === user.username ? { ...u, name, role } : u
    ));
    localStorage.setItem("crm_users", JSON.stringify(storedUsers.map((u) =>
      u.username === user.username ? { ...u, name, role } : u
    )));
  }

  function changePassword(current: string, newPass: string): boolean {
    if (!user) return false;
    const found = storedUsers.find((u) => u.username === user.username);
    if (!found || found.password !== current) return false;
    setStoredUsers((prev) => { const next = prev.map((u) => u.username === user.username ? { ...u, password: newPass } : u); localStorage.setItem("crm_users", JSON.stringify(next)); return next; });
    return true;
  }

  function addUser(username: string, password: string, name: string, role: string): boolean {
    if (storedUsers.find((u) => u.username === username)) return false;
    saveUsers([...storedUsers, { username, password, name, role }]);
    return true;
  }

  function removeUser(username: string) {
    if (username === user?.username) return;
    saveUsers(storedUsers.filter((u) => u.username !== username));
  }

  return (
    <AuthContext.Provider value={{ user, users: storedUsers, login, logout, updateProfile, changePassword, addUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
