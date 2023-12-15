import React from "react";
import { Routes, Route } from "react-router-dom";
import PersonalMessages from "./PersonalMessages";
import ChatApp from "./ChatApp";

const ChatRoutes = () => {
  return (
    <>
      <div className="Routes">
        <Routes>
          <Route path="/" element={<ChatApp />}/>
          <Route
            path="personal/:conversationId/:toUserId/:fromUserId"
            element={<PersonalMessages />}
          />
        </Routes>
      </div>
    </>
  );
};

export default ChatRoutes;
