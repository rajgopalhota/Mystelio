import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function Card({ playlists, reference }) {
  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.08 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 30 }}
    >
      <div className="card">
        <div className="info">
          <span>
            <i className="fa-solid fa-folder-open"></i>
          </span>
          <p>{playlists.playlistName}</p>
        </div>
        <div className="footer">
          <div className="download-info">
            <h5>.4mb</h5>
            <span className="download-icon">
              <i className="fa-solid fa-headphones-simple"></i>
            </span>
          </div>
          <div className="tag">
            <h3>Download Now</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
