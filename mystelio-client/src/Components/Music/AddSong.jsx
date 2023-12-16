import React, { useState } from "react";
import { useAuth, useMusic } from "./../../Context/MusicContext";
import { useParams } from "react-router-dom";

export default function AddSong() {
  const { playlistId } = useParams();
  const musicContext = useMusic();

  const [formData, setFormData] = useState({
    songName: "",
    audioFile: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];

      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
        songName: file ? file.name : "", // Set songName to file name
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    musicContext.addSongToPlaylist(playlistId, formData); // Replace 'playlistId' with the actual playlistId
    setFormData({
      songName: "",
      audioFile: null,
    });
  };

  return (
    <>
      <form className="form musicplaylistinput" onSubmit={handleFormSubmit}>
        <div className="input-box address">
          <label>
            <i className="fa-solid fa-music"></i>&nbsp;Add Audio and Tags
          </label>
          <div className="column audioinput">
            <div className="fileInputDiv">
              <label htmlFor="audioUpload">
                {!formData.audioFile && (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up"></i>&nbsp;Upload
                    Audio
                  </>
                )}
                {formData.audioFile && formData.audioFile.name.slice(0, 30)}
              </label>
              <input
                id="audioUpload"
                className="imageFile"
                type="file"
                accept="audio/*"
                name="audioFile"
                onChange={handleInputChange}
              />
            </div>
            <input
              required=""
              placeholder="Enter audio name"
              type="text"
              name="songName"
              value={formData.songName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="formInputBox-button addSongbtn">
          Upload&nbsp;<i className="fa-solid fa-music"></i>
        </button>
      </form>
    </>
  );
}
