import React, { useState } from "react";
import { useMessage } from "./../../Context/MessageContext";
import { useAuth } from "../../Context/AuthContext";
export default function ChatApp() {
  const auth = useAuth();
  const {
    conversations,
    selectedConversation,
    messages,
    sendMessage,
    selectConversation,
    messageText,
    setMessageText,
    newMessageUserId,
    setNewMessageUserId,
  } = useMessage();

  return (
    <div>
      <div style={{ display: "flex", fontSize:"1.4rem" }}>
        <div
          style={{
            width: "20%",
            borderRight: "1px solid #ccc",
            padding: "2px",
          }}
        >
          <h2>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                style={{
                  padding: "10px",
                  backgroundColor: "skyblue",
                  border:"2px solid red",
                  boxShadow:"0 0px 12px 1px red",
                  margin:"4px",
                  cursor: "pointer",
                  listStyle: "none",
                  borderRadius: "40px"
                }}
                onClick={() =>
                  selectConversation(
                    conversation.conversationId,
                    conversation.toUser.id,
                    conversation.fromUser.id
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
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          {/* New message section */}
          <div style={{ flex: 1, padding: "10px" }}>
            <h2>New Message</h2>
            {/* Input for user ID */}
            <label>
              User ID:
              <input
                type="text"
                value={newMessageUserId}
                onChange={(e) => setNewMessageUserId(e.target.value)}
              />
            </label>
            {/* Input for message text */}
            <label>
              Message:
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </label>
            {/* Button to send new message */}
            <button
              onClick={() => {
                sendMessage(newMessageUserId);
              }}
            >
              Send New Message
            </button>
          </div>

          <h2>Messages</h2>
          {messages.map((message) => (
            <div key={message.id}>
              <strong>{message.fromUser.id}:</strong> {message.body}
            </div>
          ))}
          {/* Add input and button for sending messages */}
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button onClick={() => sendMessage(selectedConversation)}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
