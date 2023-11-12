import React from "react";
import {Link} from "react-router-dom";

const Login = () => {
  return (
    <div className="login">
      <div className="container">
        <div className="heading">
          <h1 className="title"><i className="fa-solid fa-right-to-bracket"></i>&nbsp;LogIn to Mystelio</h1>
        </div>
        <form className="form" action="">
          <div className="input-box">
            <label><i className="fa-solid fa-envelope-open-text"></i>&nbsp;Enter Your email</label>
            <input
              required=""
              placeholder="example@mystelio.com"
              type="email"
            />
          </div>
          <div className="input-box">
            <label><i className="fa-solid fa-unlock-keyhole"></i>&nbsp;Enter Password</label>
            <input
              required=""
              placeholder="**********"
              type="password"
            />
          </div>
          
          <span className="forgot-password">
            <a href="/">Forgot Password ?</a>
          </span>
          <input value="Sign In" type="submit" className="login-button" />
        </form>

        <span className="agreement">
          <Link to="/register">New to Mystelio? Signup Here!</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
