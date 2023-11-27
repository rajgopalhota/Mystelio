import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import AddPost from "./AddPost";

export default function Home() {
  const auth = useAuth();
  
  return (
    <>
      <h1>Mystelio - Connect in Style</h1>
      <AddPost/>
    </>
  );
}
