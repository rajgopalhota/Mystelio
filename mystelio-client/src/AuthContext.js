import React, { useState, createContext, useContext, useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    cookies.set("frontendUser", userData, {
      path: "/",
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    setUser(userData);
  };

  const logout = () => {
    cookies.remove("frontendUser");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = cookies.get("frontendUser");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
