import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { serverUrl } from "../../UrlHelper";
import { toast } from "react-toastify";
import Replies from "./Replies";
import { Link } from "react-router-dom";
import { usePost } from "../../Context/PostContext";
import userIcon from "./../../assets/profile.png"

function Comment({ postId, comments }) {
  const auth = useAuth();
  const postContext = usePost();
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
    if (newComment === "") {
      toast(
        <>
          <i className="fa-solid fa-heart-crack"></i> {"Write something..."}
        </>
      );
    } else {
      postContext.addComment(postId, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="commentSection">
      <div className="comments">
        {auth.user && (
          <>
            <div className="user-comment-box">
              <img
                src={auth.user && auth.user.profileImage &&`${serverUrl}/${auth.user.profileImage}`||userIcon}
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
                      src={`${serverUrl}/${comment.user.profileImagePath}`}
                      alt="User"
                    />
                    <p className="center-content">{comment.comment}</p>
                  </div>
                  <div className="comment-footer">
                    <p onClick={() => handleExpandReplies(comment.id)}>
                      Replies&nbsp;
                      <i
                        className="fa-solid fa-share-from-square"
                        title="Add a reply"
                      ></i>
                      : {comment.replies.length}
                    </p>
                    <p>
                      <i className="fa-regular fa-clock"></i>{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <Link
                      to={`/users/${comment.user.id}`}
                      title={comment.user.fullName + "'s Profile"}
                    >
                      <p>
                        <i className="fa-solid fa-user"></i> {comment.user.fullName}
                      </p>
                    </Link>
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
