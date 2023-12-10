import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { serverUrl } from "../UrlHelper";
import logo from "./../assets/logo.jpg";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

export default function Profile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/auth/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <>
      {user && (
        <div className="profilePage">
          {auth.user && auth.user.id === user.id && (
            <div
              className="logout"
              onClick={() => {
                auth.logout();
                toast.success("Logged out!");
                navigate("/");
              }}
            >
              <i class="fa-solid fa-right-from-bracket"></i>
            </div>
          )}
          <img
            className="userImg"
            src={
              (user.profileImagePath &&
                `${serverUrl}/${user.profileImagePath}`) ||
              logo
            }
            alt="User"
          />
          <div className="userContainer">
            <div className="formInputBox register">
              <div className="container">
                <form className="form" encType="multipart/form-data">
                  <div className="input-box userStart">
                    <label>
                      <i className="fa-solid fa-signature"></i>&nbsp;Full Name
                    </label>
                    <input
                      required=""
                      placeholder="Enter full name"
                      type="text"
                      name="fullName"
                      value={user.fullName}
                      readOnly
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
                        type="tel"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        readOnly
                      />
                    </div>
                    <div className="input-box">
                      <label>
                        <i className="fa-solid fa-envelope-open-text"></i>
                        &nbsp;Email
                      </label>
                      <input
                        required=""
                        placeholder="Email address"
                        type="email"
                        name="email"
                        value={user.email}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>
                        <i className="fa-solid fa-cake-candles"></i>&nbsp;Birth
                        Date
                      </label>
                      <input
                        required=""
                        placeholder="Enter birth date"
                        type="text"
                        name="birthDate"
                        value={new Date(user.birthDate).toLocaleDateString()}
                        readOnly
                      />
                    </div>
                    <div className="input-box">
                      <label>
                        <i class="fa-solid fa-user-group"></i>&nbsp;Followers
                      </label>
                      <input
                        required=""
                        placeholder="Enter birth date"
                        type="text"
                        name="birthDate"
                        value={
                          "Followers: " +
                          user.followers.length +
                          "\tFollowing: " +
                          user.following.length
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box address">
                      <label>
                        <i className="fa-solid fa-folder-open"></i>
                        &nbsp;Additional Details
                      </label>
                      <div className="column">
                        <input
                          required=""
                          placeholder="Enter your Country"
                          type="text"
                          name="country"
                          value={user.country}
                          readOnly
                        />
                        <input
                          required=""
                          placeholder="Enter your city"
                          type="text"
                          name="city"
                          value={user.city}
                          readOnly
                        />
                      </div>
                    </div>
                    {/* Add more input fields as needed */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
