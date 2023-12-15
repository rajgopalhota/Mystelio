import React, { useState, createContext, useContext } from "react";
import { toast } from "react-toastify";
import axios from "../UrlHelper";
import { useAuth } from "./AuthContext";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const auth = useAuth();
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("/music/my-playlists", {
        headers: {
          Authorization: auth.user.token,
        },
      });
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error.message);
    }
  };

  const addPlaylist = async (formData) => {
    try {
      const response = await axios.post("/music/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.user.token,
        },
      });
      setPlaylists((prevPlaylists) => [
        response.data.playlist,
        ...prevPlaylists,
      ]);
      toast.success("Playlist created!");
    } catch (error) {
      console.error("Error creating playlist:", error.message);
      toast.error("Playlist creation failed");
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/music/playlist/${playlistId}`, {
        headers: {
          Authorization: auth.user.token,
        },
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((p) => p.id !== playlistId)
      );
      toast.success("Playlist deleted!");
    } catch (error) {
      console.error("Error deleting playlist:", error.message);
      toast.error("Playlist deletion failed");
    }
  };

  const addSongToPlaylist = async (playlistId, formData) => {
    try {
      await axios.post(`/music/add-song/${playlistId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.user.token,
        },
      });
      fetchPlaylists(); // Refresh playlists after adding a song
      toast.success("Song added to playlist!");
    } catch (error) {
      console.error("Error adding song to playlist:", error.message);
      toast.error("Failed to add song to playlist");
    }
  };

  const deleteSongFromPlaylist = async (songId) => {
    try {
      await axios.delete(`/music/songs/${songId}`, {
        headers: {
          Authorization: auth.user.token,
        },
      });
      fetchPlaylists(); // Refresh playlists after deleting a song
      toast.success("Song deleted from playlist!");
    } catch (error) {
      console.error("Error deleting song from playlist:", error.message);
      toast.error("Failed to delete song from playlist");
    }
  };

  const sharePlaylist = async (playlistId, userId) => {
    try {
      await axios.post(
        `/music/share/${playlistId}`,
        { userId },
        {
          headers: {
            Authorization: auth.user.token,
          },
        }
      );
      toast.success("Playlist shared successfully!");
    } catch (error) {
      console.error("Error sharing playlist:", error.message);
      toast.error("Failed to share playlist");
    }
  };

  return (
    <MusicContext.Provider
      value={{
        playlists,
        addPlaylist,
        fetchPlaylists,
        deletePlaylist,
        addSongToPlaylist,
        deleteSongFromPlaylist,
        sharePlaylist,
        // Add other functions as needed
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  return useContext(MusicContext);
};
