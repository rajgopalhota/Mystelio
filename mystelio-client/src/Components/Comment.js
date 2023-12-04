import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "../UrlHelper";
import { toast } from "react-toastify";
import Replies from "./Replies";

function Comment({ postId, comments }) {
  const auth = useAuth();
  const [newComment, setNewComment] = useState("");

  const [expandedReplies, setExpandedReplies] = useState([]);

  const handleExpandReplies = (commentId) => {
    setExpandedReplies((prevExpandedReplies) => {
      // If the commentId is already in the state, remove it; otherwise, add it
      if (prevExpandedReplies.includes(commentId)) {
        return prevExpandedReplies.filter((id) => id !== commentId);
      } else {
        return [...prevExpandedReplies, commentId];
      }
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newComment === "") {
        toast(
          <>
            <i class="fa-solid fa-heart-crack"></i> {"Write something..."}
          </>
        );
      } else {
        const authToken = auth.user.token;
        await axios.post(
          `/comment/add/${postId}`,
          {
            comment: newComment,
          },
          {
            headers: {
              Authorization: authToken, // Add the authentication token
            },
          }
        );
        setNewComment("");
        toast.success("Comment posted!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="commentSection">
      <div className="comments">
        {auth.user && (
          <>
            <div className="user-comment-box">
              <img
                src={auth.user.profileImage}
                className="user-image"
                alt="User"
              />
              <input
                required
                className="commentInput"
                type="text"
                name=""
                placeholder="Add a comment........!!!!"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="commentSubmitBtn fa-brands fa-telegram"
                onClick={handleCommentSubmit}
              />
            </div>
          </>
        )}
        <div>
          {comments.length > 0 && (
            <div>
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-body">
                    <img
                      className="user-image"
                      src={comment.user.profileImagePath}
                      alt="User"
                    />
                    <p>{comment.comment}</p>
                  </div>
                  <div className="comment-footer">
                    <p onClick={() => handleExpandReplies(comment.id)}>
                      Replies&nbsp;
                      <i
                        class="fa-solid fa-share-from-square"
                        title="Add a reply"
                      ></i>
                      : {comment.replies.length}
                    </p>
                    <p>
                      <i className="fa-regular fa-clock"></i>{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <i class="fa-solid fa-user"></i> {comment.user.fullName}
                    </p>
                  </div>
                  {expandedReplies.includes(comment.id) && (
                    <Replies commentId={comment.id} replies={comment.replies} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
