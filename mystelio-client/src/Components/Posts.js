import React from "react";
import logo from "./../assets/logo.jpg";

const Posts = ({ posts }) => {
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
