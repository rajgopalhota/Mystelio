import React, { useState, createContext, useContext } from "react";
import { toast } from "react-toastify";
import axios from "../UrlHelper";
import { useAuth } from "./AuthContext";

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/posts/all");
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const addPost = async (formData) => {
    try {
      const response = await axios.post("/posts/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.user.token,
        },
      });
      setPosts((prevPosts) => [response.data.post, ...prevPosts]);
      toast.success("Post added!");
    } catch (error) {
      console.error("Error adding post:", error.message);
      toast.error("Post addition failed");
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.get(`/posts/like/${postId}`, {
        headers: {
          Authorization: auth.user.token,
        },
      });
      fetchPosts(); // Refresh posts after liking
    } catch (error) {
      console.error("Error liking post:", error.message);
      toast.error("Failed to like post");
    }
  };

  const unlikePost = async (postId) => {
    try {
      await axios.get(`/posts/unlike/${postId}`, {
        headers: {
          Authorization: auth.user.token,
        },
      });
      fetchPosts(); // Refresh posts after unliking
    } catch (error) {
      console.error("Error unliking post:", error.message);
      toast.error("Failed to unlike post");
    }
  };

  const addComment = async (postId, comment) => {
    try {
      await axios.post(
        `/comment/add/${postId}`,
        { comment },
        {
          headers: {
            Authorization: auth.user.token,
          },
        }
      );
      fetchPosts(); // Refresh posts after adding a comment
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error.message);
      toast.error("Comment addition failed");
    }
  };

  const addReply = async (commentId, reply) => {
    try {
      await axios.post(
        `/comment/reply/${commentId}`,
        {
          reply: reply,
        },
        {
          headers: {
            Authorization: auth.user.token, // Add the authentication token
          },
        }
      );
      fetchPosts(); // Refresh posts after adding a comment
      toast.success("Reply added!");
    } catch (error) {
      console.error("Error adding Reply:", error.message);
      toast.error("Reply addition failed");
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `/posts/delete/${postId}`,
        {
          headers: {
            Authorization: auth.user.token, // Add the authentication token
          },
        }
      );
      fetchPosts(); // Refresh posts after adding a comment
      toast.success("Post deleted!");
    } catch (error) {
      console.error("Error Deleting:", error.message);
      toast.error("Post deletion failed");
    }
  };

  // Other functions for fetching comments, etc.

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        fetchPosts,
        likePost,
        unlikePost,
        addComment,
        addReply,
        deletePost
        // Add other functions as needed
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  return useContext(PostContext);
};
