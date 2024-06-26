import React, { useState } from "react";
import logo from "./../assets/logo.jpg";
import userIcon from "./../assets/profile.png";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { serverUrl } from "../UrlHelper";

function Sidebar() {
  const auth = useAuth();
  const [menu, setMenu] = useState(false);

  const handleClick = () => {
    setMenu(!menu);
  };
  return (
    <div>
      <i
        className={menu ? "fa-brands fa-square-x-twitter cross" : "fas fa-bars"}
        id="menu-bars"
        onClick={handleClick}
      ></i>
      <header className={`${menu ? "smallact" : ""}`}>
        <Link to="/" className="logo" onClick={handleClick}>
          <img
            src={
              (auth.user &&
                auth.user.profileImage &&
                `${serverUrl}/${auth.user.profileImage}`) ||
              logo
            }
            alt="Logo"
            className="logo-image"
          />
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
          <NavLink to="/friends" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-people-robbery"></i>friends
            </span>
          </NavLink>
          <NavLink to="/explore" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-magnifying-glass"></i>explore
            </span>
          </NavLink>
          <NavLink to="/music" onClick={handleClick}>
            <span>
              <i className="fa-solid fa-headphones-simple"></i>chill
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
              to={`/users/${auth.user.id}`}
              onClick={handleClick}
              className="user-profile-link"
            >
              <span className="user-profile-content">
                <img
                  src={
                    (auth.user &&
                      auth.user.profileImage &&
                      `${serverUrl}/${auth.user.profileImage}`) ||
                    userIcon
                  }
                  alt="Profile"
                  className="profile-image"
                />
                {auth.user.fullName}
              </span>
            </NavLink>
          )}
        </div>
      </header>
    </div>
  );
}

export default Sidebar;
