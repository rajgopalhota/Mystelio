import { useState } from "react";
import React from "react";
import { useAuth } from "../../Context/AuthContext";
import { serverUrl } from "../../UrlHelper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { usePost } from "../../Context/PostContext";

export default function Replies({ commentId, replies }) {
  const auth = useAuth();
  const postContext = usePost();
  const [reply, setReply] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reply === "") {
        toast(
          <>
            <i className="fa-solid fa-heart-crack"></i> {"Write something..."}
          </>
        );
      } else {
        postContext.addReply(commentId, reply);
        setReply("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  return (
    <>
      <div className="replySection">
        <div>
          {auth.user && (
            <>
              <div className="user-reply-box comments">
                <div className="reply-input-grp">
                  <input
                    type="text"
                    className="replyinput"
                    name="reply"
                    placeholder="Add a reply....."
                    autocomplete="off"
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="reply-button--submit fa-solid fa-paper-plane"
                    onClick={handleCommentSubmit}
                  />
                </div>
              </div>
            </>
          )}
          <div className="reply">
            {replies.length > 0 && (
              <div>
                {replies.map((r) => (
                  <div key={r.id} className="replyBox">
                    <Link
                      to={`/users/${r.user.id}`}
                      title={r.user.fullName + "'s Profile"}
                    >
                      <p className="center-content">
                        <img
                          src={`${serverUrl}/${r.user.profileImagePath}`}
                          className="user-image replyimgusr"
                        />
                        {r.user.fullName}
                      </p>
                    </Link>
                    <p>
                      <i className="fa-solid fa-comment-dots"></i>
                      {r.reply}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
