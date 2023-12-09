import React, { useState, useEffect } from "react";
import AddPost from "./Posts/AddPost";
import Posts from "./Posts/Posts";

export default function Home() {

  return (
    <>
      <h1>Mystelio - Connect in Style</h1>
      <AddPost />
      <h1 className="postStart">Posts by Users</h1>
      <Posts />
    </>
  );
}
