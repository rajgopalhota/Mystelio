import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Mystelio";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { PostProvider } from "./Context/PostContext";
import { MessageProvider } from "./Context/MessageContext";
import { MusicProvider } from "./Context/MusicContext";
import { UserProvider } from "./Context/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <UserProvider>
      <MessageProvider>
        <PostProvider>
          <MusicProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MusicProvider>
        </PostProvider>
      </MessageProvider>
    </UserProvider>
  </AuthProvider>
);
