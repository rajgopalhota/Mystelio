import React from "react";
import { useParams } from "react-router-dom";
import AddSong from "./AddSong";
import { useMusic } from "../../Context/MusicContext";
import { serverUrl } from "../../UrlHelper";

export default function PlayList() {
  const { playlistId } = useParams();
  const { playlists } = useMusic();
  const currentPlaylist = playlists.find(
    (playlist) => playlist.id === parseInt(playlistId)
  );

  if (!currentPlaylist) {
    return <div>Playlist not found</div>;
  }

  return (
    <>
      <AddSong playlistId={playlistId} />
      <h2>{currentPlaylist.playlistName}</h2>
      {currentPlaylist.songs.map((song) => (
        <div key={song.id}>
          <p>{song.songName}</p>
          <audio key={song.id} controls>
            <source src={`${serverUrl}/${song.audioPath.replace(/\\/g, "/")}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </>
  );
}
