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
    console.log(formData);
    musicContext.addPlaylist(formData);
    setFormData({
      playlistName: "",
      coverImage: null,
    });
  };

  return (
    <>
      <form className="form musicplaylistinput" onSubmit={handleFormSubmit}>
        <div className="input-box address">
          <label>
            <i className="fa-solid fa-folder-open"></i>&nbsp;Add Image and Tags
          </label>
          <div className="column">
            <div className="fileInputDiv">
              <label htmlFor="imageUpload">
                <i className="fa-solid fa-cloud-arrow-up"></i>&nbsp;Upload Image{" "}
                {formData.coverImage && formData.coverImage.name.slice(0, 24)}
              </label>
              <input
                id="imageUpload"
                className="imageFile"
                type="file"
                accept="image/*"
                name="coverImage"
                onChange={handleInputChange}
              />
            </div>
            <input
              required
              placeholder="Enter playlist name"
              type="text"
              name="playlistName"
              value={formData.playlistName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="formInputBox-button">
          CREATE PLAYLIST <i className="fa-solid fa-radio"></i>
        </button>
      </form>
    </>
  );
}
