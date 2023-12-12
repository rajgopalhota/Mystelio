import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "./../UrlHelper"; // Update the path
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const auth = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/dm/conversations", {
          headers: {
            Authorization: auth.user.token,
          },
        });
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error.message);
      }
    };

    fetchConversations();
  }, [auth.user]);

  // Function to send a message
  const sendMessage = async (toUserId, body) => {
    try {
      // Send the message to the server
      await axios.post(
        `/dm/${toUserId}`,
        { body },
        {
          headers: {
            Authorization: auth.user.token,
          },
        }
      );
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // Function to select a conversation and fetch messages
  const selectConversation = async (conversationId) => {
    try {
      const response = await axios.get(`/dm/${conversationId}/messages`, {
        headers: {
          Authorization: auth.user.token,
        },
      });
      setMessages(response.data.messages);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const value = {
    conversations,
    selectedConversation,
    messages,
    sendMessage,
    selectConversation,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => {
  return useContext(MessageContext);
};
