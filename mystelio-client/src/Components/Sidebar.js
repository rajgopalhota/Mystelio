import React, { useState } from "react";
import logo from "./../assets/logo.jpg";
import { NavLink, Link } from "react-router-dom";

function Sidebar() {
  const [menu, setMenu] = useState(false);

  const handleClick = () => {
    setMenu(!menu);
  };

  return (
    <div>
      <i
        className={menu ? "fas fa-times" : "fas fa-bars"}
        id="menu-bars"
        onClick={handleClick}
      ></i>
      <header className={`${menu ? "smallact" : ""}`}>
        <Link to="/" className="logo" onClick={handleClick}>
          <img src={logo} alt="Logo" className="logo-image" />
          <div className="quote">
            <p><i className="fa-brands fa-tiktok fa-fade"></i>&nbsp;Mystelio - Connect in style!</p>
          </div>
        </Link>
        <nav className="navbar">
          <NavLink to="/" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-dove"></i>home
            </span>
          </NavLink>
          <NavLink to="/explore" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-magnifying-glass"></i>explore
            </span>
          </NavLink>
          <NavLink to="/notifications" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-bell"></i>notifications
            </span>
          </NavLink>
          <NavLink to="/messages" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-comments"></i>messages
            </span>
          </NavLink>
          <NavLink to="/profile" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-user"></i>profile
            </span>
          </NavLink>
          <NavLink to="/login" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-lock fa-flip"></i> Login
            </span>
          </NavLink>
        </nav>

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
