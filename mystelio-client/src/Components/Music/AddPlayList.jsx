import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useMusic } from "../../Context/MusicContext";

export default function AddPlaylist() {
  const auth = useAuth();
  const musicContext = useMusic();

  const [formData, setFormData] = useState({
    playlistName: "",
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? e.target.files[0] : value,
    }));

  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    musicContext.addPlaylist(formData);
    setFormData({
      playlistName: "",
      coverImage: null,
    });
  };

  return (
    <>
      <div className="formInputBox playlistBox">
        <div className="container">
          <div className="heading">
            <h1 className="title">
              <i className="fa-brands fa-spotify"></i>&nbsp;Create Playlist
            </h1>
          </div>
          <form className="form" onSubmit={handleFormSubmit}>
            <div className="input-box">
              <label>
                <i className="fa-brands fa-spotify"></i>&nbsp;Playlist Name
              </label>
              <input
                required=""
                placeholder="Enter playlist name"
                type="text"
                name="playlistName"
                value={formData.playlistName}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-box">
              <div className="fileInputDiv">
                <label htmlFor="coverImageUpload">
                  <i className="fa-solid fa-cloud-arrow-up"></i>&nbsp;Upload
                  Cover Image {formData.coverImage && formData.coverImage.name}
                </label>
                <input
                  id="coverImageUpload"
                  className="imageFile"
                  type="file"
                  accept="image/*"
                  name="coverImage"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <input
              value="CREATE PLAYLIST"
              type="submit"
              className="formInputBox-button"
            />
          </form>
        </div>
      </div>
    </>
  );
}
