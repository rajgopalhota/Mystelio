import React, { useEffect, useRef } from "react";
import Card from "./Card";
import AddPlaylist from "./AddPlayList";
import { useMusic } from "./../../Context/MusicContext";
import { useAuth } from "../../Context/AuthContext";

export default function MusicApp() {
  const ref = useRef(null);
  const auth = useAuth();
  const { playlists } = useMusic();

  return (
    <div ref={ref}>
      <AddPlaylist />
      <div className="playlists">
        {playlists.map((playlist) => (
          <Card key={playlist.id} playlists={playlist} reference={ref} />
        ))}
      </div>
    </div>
  );
}
