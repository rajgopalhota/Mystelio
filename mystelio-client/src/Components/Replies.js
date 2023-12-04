import { useState } from "react";
import React from "react";
import { useAuth } from "../AuthContext";
import axios from "../UrlHelper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Replies({ commentId, replies }) {
  const auth = useAuth();
  const [reply, setReply] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reply === "") {
        toast(
          <>
            <i class="fa-solid fa-heart-crack"></i> {"Write something..."}
          </>
        );
      } else {
        const authToken = auth.user.token;
        await axios.post(
          `/comment/reply/${commentId}`,
          {
            reply: reply,
          },
          {
            headers: {
              Authorization: authToken, // Add the authentication token
            },
          }
        );
        setReply("");
        toast.success("Reply posted!");
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
                <div class="reply-input-grp">
                  <input
                    type="text"
                    class="replyinput"
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
                    <Link to = {`/users/${r.user.id}`} title={r.user.fullName + "'s Profile"}>
                    <p>
                      <img
                        src={r.user.profileImagePath}
                        className="user-image replyimgusr"
                      />
                      {r.user.fullName}
                    </p>
                    </Link>
                    <p>
                      <i class="fa-solid fa-comment-dots"></i>
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
