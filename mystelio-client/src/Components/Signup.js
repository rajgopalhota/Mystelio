import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "./../UrlHelper";
import { toast } from "react-toastify";

// Countries data in JSON format
const countriesData = [
  { value: "IND", label: "India" },
  { value: "USA", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "Japan", label: "Japan" },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    password: "",
    email: "",
    country: "",
    city: "",
    profileImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profileImage: file }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(
        <>
          <i className="fa-solid fa-handshake"></i> {"Successfully Registered"}
        </>
      );
      // Clear form data after successful submission
      setFormData({
        fullName: "",
        phoneNumber: "",
        birthDate: "",
        password: "",
        email: "",
        country: "",
        city: "",
        profileImage: null,
      });
    } catch (error) {
      console.error("Registration Error:", error.message);
    }
  };

  return (
    <div className="formInputBox register">
      <div className="container">
        <div className="heading">
          <h1 className="title">
            <i className="fa-solid fa-user-plus"></i>&nbsp;Register to Mystelio
          </h1>
        </div>
        <form
          className="form"
          onSubmit={handleFormSubmit}
          encType="multipart/form-data"
        >
          <div className="input-box">
            <label>
              <i className="fa-solid fa-signature"></i>&nbsp;Full Name
            </label>
            <input
              required=""
              placeholder="Enter full name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <div className="input-box">
              <label>
                <i className="fa-solid fa-phone"></i>&nbsp;Phone Number
              </label>
              <input
                required=""
                placeholder="Enter phone number"
                type="telephone"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-box">
              <label>
                <i className="fa-solid fa-envelope-open-text"></i>&nbsp;Enter
                Email
              </label>
              <input
                required=""
                placeholder="Enter Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="column">
            <div className="input-box">
              <label>
                <i className="fa-solid fa-cake-candles"></i>&nbsp;Birth Date
              </label>
              <input
                required=""
                placeholder="Enter birth date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-box">
              <label>
                <i className="fa-solid fa-key"></i>&nbsp;Enter Password
              </label>
              <input
                required=""
                placeholder="Enter password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-box address">
            <label>
              <i className="fa-solid fa-folder-open"></i>&nbsp;Additional
              Details
            </label>
            <div className="column">
              <div className="select-box">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {countriesData.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                required=""
                placeholder="Enter your city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-box">
            <label>
              <i className="fa-solid fa-file-image"></i>&nbsp;Profile Image
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <button className="formInputBox-button" type="submit">
            Submit
          </button>
          <span className="agreement">
            <Link to="/login">Already a user? Login Here!</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
