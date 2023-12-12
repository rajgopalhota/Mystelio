import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Mystelio";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { PostProvider } from "./Context/PostContext";
import { MessageProvider } from "./Context/MessageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <MessageProvider>
      <PostProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PostProvider>
    </MessageProvider>
  </AuthProvider>
);
