import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import logo from "./../../assets/logo.jpg";
import axios, { serverUrl } from "../../UrlHelper";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import { usePost } from "../../Context/PostContext";

const Posts = () => {
  const auth = useAuth();

  const postContext = usePost();

  useEffect(() => {
    postContext.fetchPosts();
  }, [postContext]);

  const [expandedPosts, setExpandedPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState([]);

  const handleExpandPost = (postId) => {
    setExpandedPosts((prevExpandedPosts) => [...prevExpandedPosts, postId]);
  };

  const handleExpandComments = (postId) => {
    setExpandedComments((prevExpandedComments) => {
      // If the postId is already in the state, remove it; otherwise, add it
      if (prevExpandedComments.includes(postId)) {
        return prevExpandedComments.filter((id) => id !== postId);
      } else {
        return [...prevExpandedComments, postId];
      }
    });
  };

  return (
    <div className="posts">
      {postContext.posts && postContext.posts.map((post) => (
        <div className="post" key={post.id}>
          <div className="post-header posstInfo">
            <img
              className="user-image"
              src={
                (post.created_user && post.created_user.profileImagePath &&
                  `${serverUrl}/${post.created_user.profileImagePath}`) ||
                logo
              }
              alt={post.created_user && post.created_user.fullName}
            />
            <Link to={post.created_user && `/users/${post.created_user.id}`}>
              <p className="user-name">
                {post.created_user && post.created_user.fullName} &nbsp;
                <i className="fa-solid fa-feather"></i>
              </p>
            </Link>
          </div>
          {post.postImagePath && (
            <img
              className="post-image"
              src={`${serverUrl}/${post.postImagePath}`}
              alt={post.title}
            />
          )}
          <div className="post-container">
            <h2>
              <i className="fa-solid fa-blog"></i>&nbsp;{post.title}
            </h2>
            <div className="content">
              {expandedPosts.includes(post.id) ? (
                // If post is expanded, show full content
                <p>{post.content}</p>
              ) : (
                // If post is not expanded, show only 2 lines and "Read more" link
                <div>
                  <p>
                    {post.content.slice(0, 300)}......
                    {post.content.length > 300 && (
                      <span
                        onClick={() => handleExpandPost(post.id)}
                        className="read-more"
                      >
                        &nbsp;Read more{" "}
                        <i className="fa-solid fa-angles-right fa-fade"></i>
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="posstInfo">
            <div className="center-content">
              <p>
                <i className="fa-solid fa-tags"></i> {post.tags}
              </p>
            </div>
            <div className="posstInfo-footer">
              {auth.user &&
              auth.user.id &&
              post.likes.some((user) => user.id === auth.user.id) ? (
                // If the logged-in user's ID is in the likes array, show Dislike button
                <button
                  onClick={() => postContext.unlikePost(post.id)}
                  className="likebutton"
                >
                  <i className="fa-solid fa-heart"></i>{" "}
                  <p>{post.likes.length}</p>
                </button>
              ) : (
                // If the logged-in user's ID is NOT in the likes array, show Like button
                <button
                  onClick={() => postContext.likePost(post.id)}
                  className="likebutton likebtn"
                >
                  <i className="fa-regular fa-heart"></i>{" "}
                  <p>{post.likes.length}</p>
                </button>
              )}
              <p
                className="comments"
                onClick={() => handleExpandComments(post.id)}
              >
                <i className="fa-regular fa-comments"></i>&nbsp;
                {post.comments.length}
              </p>
              <p>
                <i className="fa-regular fa-clock"></i>{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
            {expandedComments.includes(post.id) && (
              <Comment postId={post.id} comments={post.comments} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
