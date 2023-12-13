// PersonalMessages.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMessage } from "./../../Context/MessageContext";

const PersonalMessages = () => {
  const { conversationId, toUserId, fromUserId } = useParams();
  const {
    messages,
    sendMessage,
    setMessageText,
    messageText,
    selectConversation,
  } = useMessage();

  useEffect(() => {
    selectConversation(conversationId, fromUserId, toUserId);
  }, [conversationId, fromUserId, toUserId, selectConversation]);

  return (
    <div>
      <h2>Personal Messages</h2>
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
      <button onClick={() => sendMessage(toUserId)}>Send Message</button>
    </div>
  );
};

export default PersonalMessages;
