import React, { useEffect, useState } from "react";
import axios from "../../UrlHelper";
import io from "socket.io-client";
import { useAuth } from "./../../Context/AuthContext";

const socket = io("http://localhost:5000");

export default function ChatApp() {
  const auth = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();

    // Handle socket events
    socket.on("newMessage", (data) => handleNewMessage(data));

    return () => {
      // Cleanup socket connection on component unmount
      socket.off("newMessage");
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get("/messages/conversations", {
        headers: {
          Authorization: auth.user.token,
        },
      });
      setConversations(response.data.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `/messages/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: auth.user.token,
          },
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      // Make a POST request to send the message
      const response = await axios.post(
        `/messages/conversations/${selectedConversation.id}/messages`,
        {
          body: newMessage,
        },
        {
          headers: {
            Authorization: auth.user.token,
          },
        }
      );

      // Update the messages state
      setMessages((prevMessages) => [...prevMessages, response.data.message]);

      // Emit a socket event to notify the server about the new message
      socket.emit("sendMessage", {
        conversationId: selectedConversation.id,
        message: response.data.message,
      });

      // Clear the newMessage state
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessage = (data) => {
    // Update the messages state when a new message is received
    setMessages((prevMessages) => [...prevMessages, data.message]);
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

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
                onClick={() => handleConversationClick(conversation)}
              >
                {conversation.recipients
                  .map((recipient) => recipient.username)
                  .join(", ")}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          <h2>Messages</h2>
          {selectedConversation ? (
            <>
              <div>
                {messages.map((message) => (
                  <div key={message.id}>
                    <strong>{message.fromUser.username}:</strong> {message.body}
                  </div>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <p>Select a conversation to view messages.</p>
          )}
        </div>
      </div>
    </div>
  );
}
