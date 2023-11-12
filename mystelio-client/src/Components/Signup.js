import React from "react";
import {Link} from "react-router-dom"

const Signup = () => {
  return (
    <div className="login register">
      <div className="container">
      <div className="heading"><h1 className="title"><i className="fa-solid fa-user-plus"></i>&nbsp;Register to Mystelio</h1></div>
        <form className="form" action="#">
          <div className="input-box">
            <label><i className="fa-solid fa-signature"></i>&nbsp;Full Name</label>
            <input required="" placeholder="Enter full name" type="text" />
          </div>
          <div className="column">
            <div className="input-box">
              <label><i className="fa-solid fa-phone"></i>&nbsp;Phone Number</label>
              <input
                required=""
                placeholder="Enter phone number"
                type="telephone"
              />
            </div>
            <div className="input-box">
              <label><i className="fa-solid fa-cake-candles"></i>&nbsp;Birth Date</label>
              <input required="" placeholder="Enter birth date" type="date" />
            </div>
          </div>
          <div className="column">
            <div className="input-box">
              <label><i className="fa-solid fa-key"></i>&nbsp;Enter Password</label>
              <input
                required=""
                placeholder="Enter password"
                type="password"
              />
            </div>
            <div className="input-box">
              <label><i className="fa-solid fa-key"></i>&nbsp;Re Enter Password</label>
              <input required="" placeholder="Re Enter Password" type="password" />
            </div>
          </div>
          
          <div className="input-box address">
            <label><i className="fa-solid fa-folder-open"></i>&nbsp;Additional Details</label>
            <input required="" placeholder="Enter Email address" type="email" />
            <div className="column">
              <div className="select-box">
                <select>
                  <option hidden="">Country</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Germany</option>
                  <option>Japan</option>
                </select>
              </div>
              <input required="" placeholder="Enter your city" type="text" />
            </div>
          </div>
          <button className="login-button">Submit</button>
          <span className="agreement">
          <Link to="/login">Already a user? Login Here!</Link>
        </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
