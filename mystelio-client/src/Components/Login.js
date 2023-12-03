import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./../UrlHelper";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      const user = {
        id: response.data.id,
        fullName: response.data.fullName,
        phoneNumber: response.data.phoneNumber,
        birthDate: response.data.birthDate,
        email: response.data.email,
        country: response.data.country,
        city: response.data.city,
        creted_at: response.data.creted_at,
        updated_at: response.data.updated_at,
        profileImage: response.data.profileImage,
        token: response.data.token,
      };
      auth.login(user);
      navigate("/")
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
    <div className="formInputBox">
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
          <input value="Sign In" type="submit" className="formInputBox-button" />
        </form>

        <span className="agreement">
          <Link to="/register">New to Mystelio? Signup Here!</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
