import React, { useState } from "react";
import logo from "./../assets/logo.jpg";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Sidebar() {
  const auth = useAuth();
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
            <p>
              <i className="fa-brands fa-tiktok fa-fade"></i>&nbsp;Mystelio -
              Connect in style!
            </p>
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
        </nav>

        <div className="profile navbar">
          {!auth.user && (
            <NavLink to="/login" onClick={handleClick}>
              <span>
                <i className="fa-solid fa-lock fa-flip"></i> Login
              </span>
            </NavLink>
          )}
          {auth.user && (
            <NavLink
              to="/profile"
              onClick={handleClick}
              className="user-profile-link"
            >
              <span className="user-profile-content">
                <img
                  src="http://localhost:5000/uploads/profilepics/profileImage-1700756228821-703172628.jpg"
                  alt="Profile"
                  className="profile-image"
                />
                {" username"}
              </span>
            </NavLink>
          )}
        </div>
      </header>
    </div>
  );
}

export default Sidebar;
