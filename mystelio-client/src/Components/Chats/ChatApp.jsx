import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMessage } from "./../../Context/MessageContext";
import { useAuth } from "../../Context/AuthContext";
import { serverUrl } from "../../UrlHelper";

const ChatApp = () => {
  const [newTo, setNewTo] = useState("");
  const [messageText, setMessageText] = useState("");
  const { conversations, selectConversation, sendMessage } = useMessage();
  const auth = useAuth();

  return (
    <div className="ChatApp">
      <div className="new-message-section">
        <div className="new-message-section">
          <h2>New Message</h2>
          <label>
            User ID:
            <input
              type="text"
              value={newTo}
              onChange={(e) => setNewTo(e.target.value)}
            />
          </label>
          <label>
            Message:
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              sendMessage(newTo, messageText);
            }}
          >
            Send New Message
          </button>
        </div>
      </div>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            to={`personal/${conversation.conversationId}/${conversation.toUser.id}/${conversation.fromUser.id}`}
            onClick={() => selectConversation(conversation.conversationId)}
          >
            <li className="conversation-list">
              {auth.user.id === conversation.fromUser.id ? (
                // Display toUser if logged-in user is the sender (fromUser)
                <div className="chatUserInfo">
                  <img
                    src={`${serverUrl}/${conversation.toUser.profileImagePath}`}
                  />
                  <div className="userInfo">
                    <p>
                      <span><i className="fa-regular fa-circle-up"></i></span> {conversation.toUser.username}
                    </p>
                    <p>
                      <span><i className="fa-regular fa-comments"></i></span> {conversation.body.slice(0, 3)}...
                    </p>
                    <p>
                      <span><i className="fa-regular fa-clock fa-spin"></i></span>
                      {" "}{new Date(conversation.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                // Display fromUser if logged-in user is the recipient (toUser)
                <div className="chatUserInfo">
                  <img
                    src={`${serverUrl}/${conversation.fromUser.profileImagePath}`}
                  />
                  <div className="userInfo">
                    <p>
                      <span><i className="fa-regular fa-circle-down"></i></span> {conversation.fromUser.username}
                    </p>
                    <p>
                      <span><i className="fa-regular fa-comments"></i></span> {conversation.body.slice(0, 3)}...
                    </p>
                    <p>
                      <span><i className="fa-regular fa-clock fa-spin"></i></span>
                      {" "}{new Date(conversation.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ChatApp;
