import React, { useEffect, useRef } from "react";
import Card from "./Card";
import AddPlaylist from "./AddPlayList";
import { useMusic } from "./../../Context/MusicContext";

export default function MusicApp() {
  const ref = useRef(null);
  const { playlists, fetchPlaylists } = useMusic();

  useEffect(() => {
    if (playlists.length === 0) {
      fetchPlaylists();
    }
  }, [fetchPlaylists]);

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
