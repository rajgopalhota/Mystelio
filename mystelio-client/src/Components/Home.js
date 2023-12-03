import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import AddPost from "./AddPost";
import axios from "./../UrlHelper";
import Posts from "./Posts";

export default function Home() {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts/all");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        // Handle errors as needed
      }
    };

    fetchPosts();
  }, [posts]);

  return (
    <>
      <h1>Mystelio - Connect in Style</h1>
      <AddPost />
      {/* <p>
        {auth.user.token}
      </p> */}
      <h1 className="postStart">Posts by Users</h1>
      <Posts posts={posts} />
    </>
  );
}
