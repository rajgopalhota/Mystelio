import React, { useState, createContext, useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import axios from "./../UrlHelper";

const cookies = new Cookies();
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    cookies.set("frontendUser", userData.token, {
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
    const fetchUser = async () => {
      const token = cookies.get("frontendUser");
      console.log(token);
      try {
        const response = await axios.get("/auth/fetch-user", {
          headers: {
            Authorization: token, // Add the authentication token
          },
        });
        console.log("auth", response);
        if (response.data.success) {
          response.data.user.token = token;
          setUser(response.data.user);
        }
      } catch (error) {
        toast.error("Please re login", error.message);
      }
    };
    fetchUser();
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
