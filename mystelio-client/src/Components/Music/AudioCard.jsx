import React from "react";
import audiopic from "./../../assets/images/audio.jpg";

export default function AudioCard(props) {
  console.log(props);
  return (
    <>
      <div className="card" style={{ backgroundImage: `url(${audiopic})` }}>
        <div className="info">
          <span className="download-icon">
            <i className="fa-solid fa-headphones-simple"></i>
          </span>
          <p>{props.song.songName.slice(0, 20)}....</p>
        </div>
        <div className="footer">
          <div className="tag">
            <h3>
              {props.isPlay?<>Playing..<i class="fa-solid fa-circle-play fa-spin"></i></>:<>Play Now <i className="fa-solid fa-music"></i></>}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
