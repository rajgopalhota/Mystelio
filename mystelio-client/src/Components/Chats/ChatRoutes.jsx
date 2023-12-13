import React from "react";
import { Routes, Route } from "react-router-dom";
import PersonalMessages from "./PersonalMessages";
import ChatApp from "./ChatApp";

const ChatRoutes = () => {
  return (
    <>
      <div style={{ display: "flex", fontSize: "1.4rem" }}>
      <div
          style={{
            width: "20%",
            borderRight: "1px solid #ccc",
            padding: "10px",
          }}
        >
        <ChatApp />
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          <Routes>
            <Route
              path="personal/:conversationId/:toUserId/:fromUserId"
              element={<PersonalMessages />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default ChatRoutes;
