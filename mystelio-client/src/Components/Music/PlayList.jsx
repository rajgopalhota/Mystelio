import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import AddSong from "./AddSong";
import { useMusic } from "../../Context/MusicContext";
import { serverUrl } from "../../UrlHelper";
import { useAuth } from "../../Context/AuthContext";

export default function PlayList() {
  const auth = useAuth();
  const { playlistId } = useParams();
  const { playlists } = useMusic();
  const filteredPlaylists = playlists.filter(
    (playlist) => playlist.id == playlistId
  );

  // Check if filteredPlaylists is not empty
  if (filteredPlaylists.length > 0) {
    const songs = filteredPlaylists[0].songs; // Accessing songs

    console.log(songs); // Logs the songs to the console

    return (
      <>
        <AddSong />
        {songs.map((song) => (
          <div key={song.id}>
            <p>{song.songName}</p>
            <audio key={song.id} controls>
              <source
                src={`${serverUrl}/${song.audioPath.replace(/\\/g, "/")}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </>
    );
  } else {
    return (
      <>
        <AddSong />
        {/* Display a message when no matching playlist is found */}
        <p>No matching playlist found</p>
      </>
    );
  }
}
