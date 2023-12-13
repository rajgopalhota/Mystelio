import React from "react";
import { Link } from "react-router-dom";
import { useMessage } from "./../../Context/MessageContext";
import { useAuth } from "../../Context/AuthContext";

const ChatApp = () => {
  const { conversations, selectConversation } = useMessage();
  const auth = useAuth();
  return (
    <div>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            style={{
              padding: "10px",
              backgroundColor: "skyblue",
              border: "2px solid red",
              boxShadow: "0 0px 12px 1px red",
              margin: "4px",
              cursor: "pointer",
              listStyle: "none",
              borderRadius: "40px",
            }}
          >
            <Link
              to={`personal/${conversation.conversationId}/${conversation.toUser.id}/${conversation.fromUser.id}`}
              onClick={() =>
                selectConversation(
                  conversation.conversationId,
                  conversation.fromUser.id,
                  conversation.toUser.id
                )
              }
            >
              {auth.user.id === conversation.fromUser.id ? (
                // Display toUser if logged-in user is the sender (fromUser)
                <>
                  To: {conversation.toUser.id}, {conversation.toUser.username}
                </>
              ) : (
                // Display fromUser if logged-in user is the recipient (toUser)
                <>
                  From: {conversation.fromUser.id},{" "}
                  {conversation.fromUser.username}
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatApp;
