import React, { useState } from "react";
import logo from "./../assets/logo.jpg";

function Sidebar() {
  const [menu, setMenu] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  const handleClick = () => {
    setMenu(!menu);
  };

  const handleThemeToggle = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div>
      <i
        className={menu ? "fas fa-times" : "fas fa-bars"}
        id="menu-bars"
        onClick={handleClick}
      ></i>
      <header className={`${menu ? "active" : ""}`}>
        <a href="/#home" className="logo">
          <img
            src={logo}
            alt="Logo"
            className="logo-image"
          />
        </a>

        <nav className="navbar">
          <a href="/#home">home</a>
          <a href="/#about">about</a>
          <a href="/#achievement">Achievements</a>
          <a href="/#experience">perks</a>
          <a href="/#experience">perks</a>
          <a href="/#portfolio">portfolio</a>
          <a href="/#playground">stats</a>
          <a href="/#contact">contact</a>
        </nav>

        <label className="ui-switch">
          <input type="checkbox" checked={darkTheme} onChange={handleThemeToggle} />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>

        <div className="follow">
          <a
            href="https://www.facebook.com/hotarajgopal/"
            className="fab fa-facebook-f"
            target="_blank"
            rel="noreferrer"
          ></a>
          <a
            href="https://twitter.com/RajgopalHota"
            className="fab fa-twitter"
            target="_blank"
            rel="noreferrer"
          ></a>
          <a
            href="https://www.instagram.com/rajgopal.hota/"
            className="fab fa-instagram"
            target="_blank"
            rel="noreferrer"
          ></a>
          <a
            href="https://in.linkedin.com/in/rajgopalhota"
            className="fab fa-linkedin"
            target="_blank"
            rel="noreferrer"
          ></a>
        </div>
      </header>
    </div>
  );
}

export default Sidebar;
