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
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>

        <nav className="navbar">
          <NavLink to="/"><i class="fa-solid fa-dove"></i>&nbsp;home</NavLink>
          <NavLink to="/register"><i class="fa-solid fa-user-plus"></i>&nbsp;Register</NavLink>
          <NavLink to="/login"><i class="fa-solid fa-lock fa-flip"></i>&nbsp; Login</NavLink>
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
