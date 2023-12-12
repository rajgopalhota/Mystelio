import React, { useEffect, useState } from "react";
import { useAuth } from "./../../Context/AuthContext";
import { useMessage } from "./../../Context/MessageContext";
export default function ChatApp() {
  const [messageText, setMessageText] = useState("");
  const auth = useAuth();
  const {
    conversations,
    selectedConversation,
    messages,
    sendMessage,
    selectConversation,
  } = useMessage();
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      selectConversation(selectedConversation);
    }
  }, [selectedConversation, selectConversation]);

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
                onClick={() => selectConversation(conversation.id)}
              >
                {conversation.fromUser.username}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
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
