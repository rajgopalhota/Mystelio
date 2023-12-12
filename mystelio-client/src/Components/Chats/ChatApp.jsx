import React, { useState } from "react";
import { useAuth } from "./../../Context/AuthContext";
import { useMessage } from "./../../Context/MessageContext";
export default function ChatApp() {
  const [messageText, setMessageText] = useState("");
  const [newMessageUserId, setNewMessageUserId] = useState("");
  const {
    conversations,
    selectedConversation,
    messages,
    sendMessage,
    selectConversation,
  } = useMessage();

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "30%",
            borderRight: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h2>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                style={{
                  padding: "10px",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() =>
                  selectConversation(
                    conversation.conversationId,
                    conversation.toUser.id
                  )
                }
              >
                {conversation.fromUser.id}, {conversation.toUser.id}
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
                sendMessage(newMessageUserId, messageText);
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
          <button
            onClick={() => sendMessage(selectedConversation, messageText)}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
