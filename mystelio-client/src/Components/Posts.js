import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import logo from "./../assets/logo.jpg";
import axios from "./../UrlHelper";

const Posts = ({ posts }) => {
  const auth = useAuth();

  const handleLike = async (postId) => {
    try {
      const authToken = auth.user.token;
      const response = await axios.get(`/posts/like/${postId}`, {
        headers: {
          Authorization: authToken,
        },
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  const handleDislike = async (postId) => {
    try {
      const authToken = auth.user.token;
      const response = await axios.get(`/posts/unlike/${postId}`, {
        headers: {
          Authorization: authToken,
        },
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  return (
    <div className="posts">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <div className="post-header">
            <img
              className="user-image"
              src={post.created_user.profileImagePath || logo}
              alt={post.created_user.fullName}
            />
            <p className="user-name">{post.created_user.fullName}</p>
          </div>
          <div className="post-container">
            {post.postImagePath && (
              <img
                className="post-image"
                src={post.postImagePath}
                alt={post.title}
              />
            )}
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
          <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
          <p>Tags: {post.tags}</p>
          <p>Likes: {post.likes.length}</p>
          {auth.user.id &&
          post.likes.some((user) => user.id === auth.user.id) ? (
            // If the logged-in user's ID is in the likes array, show Dislike button
            <button onClick={() => handleDislike(post.id)}>
              <i className="fas fa-thumbs-down"></i> Dislike
            </button>
          ) : (
            // If the logged-in user's ID is NOT in the likes array, show Like button
            <button onClick={() => handleLike(post.id)}>
              <i className="fas fa-thumbs-up"></i> Like
            </button>
          )}
          {post.comments.length > 0 && (
            <div>
              <h3>Comments:</h3>
              {post.comments.map((comment, index) => (
                <p key={index}>{comment}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Posts;
