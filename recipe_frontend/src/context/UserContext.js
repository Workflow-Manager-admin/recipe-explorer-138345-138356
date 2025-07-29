import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../utils/api";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

// PUBLIC_INTERFACE
export default function UserContextProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token") || ""
  );
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    api
      .getMe(token)
      .then((u) => setUser(u))
      .catch(() => {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    const resp = await api.login(email, password);
    setToken(resp.access_token);
    localStorage.setItem("token", resp.access_token);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  // PUBLIC_INTERFACE
  const register = async (email, password, full_name) => {
    const resp = await api.register(email, password, full_name);
    setToken(resp.access_token);
    localStorage.setItem("token", resp.access_token);
  };

  return (
    <UserContext.Provider
      value={{ user, token, setToken, setUser, login, logout, register, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}
