import { createContext, useContext, useEffect, useState } from "react";
import { clearSetlistCache } from "../services/setlistRepository";

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
  role: "admin" | "user";
}

interface UserContextValue {
  user: SessionUser | null;
  loading: boolean;
  logout(): Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { user: SessionUser | null }) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    clearSetlistCache();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
