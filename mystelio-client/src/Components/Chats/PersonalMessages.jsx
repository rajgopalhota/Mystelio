// PersonalMessages.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMessage } from "./../../Context/MessageContext";
import { useAuth } from "../../Context/AuthContext";
import userIcon from "./../../assets/profile.png";
import { serverUrl } from "../../UrlHelper";

const PersonalMessages = () => {
  const { conversationId, toUserId, fromUserId } = useParams();
  const [messageText, setMessageText] = useState();

  const auth = useAuth();
  const { messages, sendMessage, selectConversation } = useMessage();

  useEffect(() => {
    selectConversation(conversationId, fromUserId, toUserId);
  }, [conversationId, fromUserId, toUserId, selectConversation]);

  return (
    <div className="personal-messages-container">
      <h2>Personal Messages</h2>
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              auth.user.id === message.fromUser.id ? "sent" : "received"
            }`}
          >
            {auth.user.id !== message.fromUser.id && (
              <img
                src={
                  (message.fromUser.profileImagePath &&
                    `${serverUrl}/${message.fromUser.profileImagePath}`) ||
                  userIcon
                }
                alt={`${message.fromUser.id}'s avatar`}
                className="avatar"
              />
            )}
            <p>{message.body}</p>
            {auth.user.id === message.fromUser.id && (
              <img
                src={
                  (auth.user &&
                    auth.user.profileImage &&
                    `${serverUrl}/${auth.user.profileImage}`) ||
                  userIcon
                }
                alt={`${auth.user.id}'s avatar`}
                className="avatar"
              />
            )}
          </div>
        ))}
      </div>
      {/* Add input and button for sending messages */}
      <div className="input-container">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button
          onClick={() =>
            sendMessage(
              auth.user.id === toUserId ? fromUserId : toUserId,
              messageText
            )
          }
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default PersonalMessages;
