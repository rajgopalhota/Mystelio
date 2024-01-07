import React, { useEffect } from "react";
import { useUsersData } from "../Context/UserContext";

export default function Explore() {
  const usersData = useUsersData();
  useEffect(()=>{
    usersData.fetchUsers();
  }, [])
  console.log(usersData.users);
  return(
    <div>
    </div>
  );
}
