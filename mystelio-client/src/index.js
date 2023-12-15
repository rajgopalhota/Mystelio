import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Mystelio";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { PostProvider } from "./Context/PostContext";
import { MessageProvider } from "./Context/MessageContext";
import { MusicProvider } from "./Context/MusicContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <MessageProvider>
      <PostProvider>
        <MusicProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MusicProvider>
      </PostProvider>
    </MessageProvider>
  </AuthProvider>
);
