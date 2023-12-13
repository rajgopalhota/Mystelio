import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { serverUrl } from "./../UrlHelper"; // Update the path
import { useAuth } from "./AuthContext";
import io from "socket.io-client";
import { toast } from "react-toastify";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const auth = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [newMessageUserId, setNewMessageUserId] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a WebSocket connection
    const newSocket = io(serverUrl);
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.connected);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      // Update the corresponding conversation
      setConversations((prevConversations) => {
        return prevConversations.map((conversation) =>
          conversation.id === data.conversationId
            ? { ...conversation, lastMessage: data.message }
            : conversation
        );
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, conversations]);

  useEffect(() => {
    // Fetch conversations when the user or conversations list changes
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/dm/conversations", {
          headers: {
            Authorization: auth.user.token,
          },
        });
        console.log("object");
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error.message);
      }
    };

    if (auth.user) {
      fetchConversations();
    }
  }, [auth.user]);

  // Function to send a message
  // Function to send a message
  const sendMessage = async (toUserId) => {
    try {
      console.log(toUserId);
      if (auth.user.id == toUserId) {
        toast.error("Cannot send a message to yourself.");
        return;
      }

      // Send the message to the server
      await axios.post(
        `/dm/${toUserId}`,
        { body: messageText },
        {
          headers: {
            Authorization: auth.user.token,
          },
        }
      );
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // Function to select a conversation and fetch messages
  const selectConversation = async (conversationId, fromUserId, toUserId) => {
    try {
      const response = await axios.get(`/dm/${conversationId}/messages`, {
        headers: {
          Authorization: auth.user.token,
        },
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const value = {
    conversations,
    messages,
    sendMessage,
    selectConversation,
    messageText,
    setMessageText,
    newMessageUserId,
    setNewMessageUserId,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => {
  return useContext(MessageContext);
};
