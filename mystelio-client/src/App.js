import React from "react";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Sidebar from "./Components/Sidebar";
import Home from "./Components/Home";
import "./Styles/App.css";
import "./Styles/Sidebar.css";
import "./Styles/UiVerse.css";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Sidebar />
      <section className="content">
        <h1>Mystelio App</h1>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Signup/>} />
        </Routes>
      </section>
    </>
  );
};

export default App;
