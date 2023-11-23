import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./../UrlHelper";
import { toast } from "react-toastify";

const Login = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageFetch = (userData) => {
    if (userData && userData.profileImage) {
      // Assuming userData.profileImage contains the file path
      const imageUrl = `http://localhost:5000/${userData.profileImage.replace(
        "\\",
        "/"
      )}`;
      console.log(imageUrl);
      setUser((prevUser) => ({ ...prevUser, profileImage: imageUrl }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      const token = response.data.token;
      const userData = response.data.user;
      setUser(userData);
      handleImageFetch(userData);
      console.log(user)
      // Handle the token as needed (e.g., store it in local storage or a state variable)
      toast.success("Login Successful");

      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      // Handle errors, you can console.log them for now
      console.error("Login Error:", error.message);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="heading">
          <h1 className="title">
            <i className="fa-solid fa-right-to-bracket"></i>&nbsp;LogIn to
            Mystelio
          </h1>
        </div>
        <form className="form" onSubmit={handleFormSubmit}>
          <div className="input-box">
            <label>
              <i className="fa-solid fa-envelope-open-text"></i>&nbsp;Enter Your
              email
            </label>
            <input
              required=""
              placeholder="example@mystelio.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-box">
            <label>
              <i className="fa-solid fa-unlock-keyhole"></i>&nbsp;Enter Password
            </label>
            <input
              required=""
              placeholder="**********"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <span className="forgot-password">
            <Link to="/">Forgot Password ?</Link>
          </span>
          <input value="Sign In" type="submit" className="login-button" />
        </form>

        <span className="agreement">
          <Link to="/register">New to Mystelio? Signup Here!</Link>
        </span>
      </div>
      {user && user.profileImage && (
        <img className="profilepic" src={user.profileImage} alt="Profile" />
      )}
      {user && user.fullName}
    </div>
  );
};

export default Login;
