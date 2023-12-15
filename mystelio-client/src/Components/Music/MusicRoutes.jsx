import React from "react";
import { Routes, Route } from "react-router-dom";
import MusicApp from "./MusicApp";
import PlayList from "./PlayList";

export default function MusicRoutes() {
  return (
    <>
      <h1 className="bgText">Chilling Area</h1>
      <div className="MusicContainer">
        <Routes>
          <Route path="/" element={<MusicApp />} />
          <Route path="playlist/:playlistId" element={<PlayList />} />
        </Routes>
      </div>
    </>
  );
}
