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
  const [newMessageUserId, setNewMessageUserId] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a WebSocket connection
    const newSocket = io(serverUrl);

    if (auth.user) {
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.connected);
        const userId = auth.user.id;
        newSocket.emit("joinRoom", userId);
      });
    }

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [auth.user]);

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
  useEffect(() => {
    if (auth.user) {
      fetchConversations();
    }
  }, [auth.user]);

  // Function to send a message
  const sendMessage = async (toUserId, message) => {
    try {
      console.log(toUserId);
      if (auth.user.id == toUserId) {
        toast.error("Cannot send a message to yourself.");
        return;
      }

      // Send the message to the server
      await axios.post(
        `/dm/${toUserId}`,
        { body: message },
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
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const value = {
    conversations,
    messages,
    sendMessage,
    selectConversation,
    newMessageUserId,
    setNewMessageUserId,
  };
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      console.log("ssssssssss",data);
      if (data.message.fromUserId != auth.user.id) {
        toast("New Message");
      }
      fetchConversations();
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, conversations]);

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => {
  return useContext(MessageContext);
};
