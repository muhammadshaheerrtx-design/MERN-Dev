import { createContext, useContext, useState } from "react";
import { setAuthToken } from "../api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "taskline_token";
const USER_KEY = "taskline_user";

export function AuthProvider({ children }) {
  // Read from localStorage synchronously on first render, so a page
  // refresh doesn't briefly flash the login screen before restoring
  // a valid session.
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    // Attach the token to axios RIGHT HERE, during render, not in a
    // useEffect. This matters because a child route (e.g. TasksPage)
    // can mount and fire its own data-fetching effect BEFORE a parent
    // component's effect runs — React fires child effects before parent
    // effects on mount. If attaching the header were left to an effect
    // here, the very first request after login/refresh could go out
    // with no Authorization header at all, causing a spurious 401.
    setAuthToken(stored);
    return stored;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  function login(newToken, newUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setAuthToken(newToken); // synchronous — happens before navigate() runs
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null); // synchronous — no stale header lingers on axios
    setToken(null);
    setUser(null);
  }

  const value = { token, user, isAuthenticated: Boolean(token), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
