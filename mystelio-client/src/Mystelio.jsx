import React from "react";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Sidebar from "./Components/Sidebar";
import MusicRoutes from "./Components/Music/MusicRoutes";
import Home from "./Components/Home";
import "./Styles/App.css";
import "./Styles/Sidebar.css";
import "./Styles/Music.css";
import "./Styles/ProfilePage.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/UiVerse.css";
import { Routes, Route } from "react-router-dom";
import Profile from "./Components/Profile/Profile";
import ChatRoutes from "./Components/Chats/ChatRoutes";

const App = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Sidebar />
      <section className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messages/*" element={<ChatRoutes />} />
          <Route path="/music/*" element={<MusicRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:userId" element={<Profile />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </section>
    </>
  );
};

export default App;
