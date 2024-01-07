import React, { useState, createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "./../UrlHelper";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const auth = useAuth();
  const [users, setUsers] = useState();
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/auth/allusers");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  return (
    <UserContext.Provider value={{ fetchUsers, users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsersData = () => {
  return useContext(UserContext);
};
