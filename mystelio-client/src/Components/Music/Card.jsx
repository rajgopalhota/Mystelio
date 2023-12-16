import React from "react";
import { motion } from "framer-motion";
import { serverUrl } from "../../UrlHelper";
import { Link } from "react-router-dom";

export default function Card({ playlists, reference }) {
  const { albumCover, playlistName } = playlists;
  const backgroundImage = `${serverUrl}/${albumCover.replace(/\\/g, "/")}`;
  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.08 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 30 }}
    >
      <div
        className="card"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="info">
          <span>
            <i className="fa-solid fa-folder-open"></i>
          </span>
          <p>{playlistName}</p>
        </div>
        <div className="footer">
          <div className="download-info">
            <h5>.4mb</h5>
            <span className="download-icon">
              <i className="fa-solid fa-headphones-simple"></i>
            </span>
          </div>
          <Link to={`playlist/${playlists.id}`}>
            <div className="tag">
              <h3>
                Listen Now <i class="fa-solid fa-music"></i>
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
