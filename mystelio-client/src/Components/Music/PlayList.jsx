import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddSong from "./AddSong";
import { useMusic } from "../../Context/MusicContext";
import { serverUrl } from "../../UrlHelper";
import { useAuth } from "../../Context/AuthContext";
import ReactPlayer from "react-player";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function PlayList() {
  const auth = useAuth();
  const { playlistId } = useParams();
  const { playlists } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const filteredPlaylists = playlists.filter(
    (playlist) => playlist.id == playlistId
  );

  const songs = filteredPlaylists.length > 0 ? filteredPlaylists[0].songs : [];

  const playNextSong = () => {
    if (isShuffle) {
      setSelectedSong((prevIndex) =>
        prevIndex === selectedSong
          ? Math.floor(Math.random() * songs.length)
          : prevIndex
      );
    } else {
      setSelectedSong((prevIndex) => (prevIndex + 1) % songs.length);
    }
  };

  const playPreviousSong = () => {
    if (isShuffle) {
      setSelectedSong((prevIndex) =>
        prevIndex === selectedSong
          ? Math.floor(Math.random() * songs.length)
          : prevIndex
      );
    } else {
      setSelectedSong(
        (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
      );
    }
  };

  const handleEnded = () => {
    playNextSong();
  };

  const toggleShuffle = () => {
    setIsShuffle((prevShuffle) => !prevShuffle);
  };

  const togglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const selectSong = (index) => {
    setSelectedSong(index);
    setIsPlaying(true); // Start playing when a new song is selected
  };

  const playerRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeChange = (value) => {
    setVolume(value / 100);
  };

  const handleProgress = (progress) => {
    setPlayed(progress.played);
  };

  const handleSeekChange = (value) => {
    playerRef.current.seekTo(value / 100);
  };

  useEffect(() => {
    // Automatically select and play a random song when the component mounts
    const randomSongIndex = Math.floor(Math.random() * songs.length);
    selectSong(randomSongIndex);
  }, [songs]);

  useEffect(() => {
    // Play the selected song when isPlaying changes
    if (isPlaying) {
      playerRef.current.seekTo(0); // Reset the playback progress
    }
  }, [isPlaying]);

  return (
    <>
      <div className="songscontainer">
        <AddSong />
        <div className="song-list">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`song-card ${selectedSong === index ? "active" : ""}`}
              onClick={() => selectSong(index)}
            >
              <p>{song.songName}</p>
              <p>{song.artist}</p>
              <p>{song.album}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedSong !== null && (
        <div className="bottom-player">
          <p>{songs[selectedSong].songName}</p>
          <ReactPlayer
            ref={playerRef}
            url={`${serverUrl}/${songs[selectedSong].audioPath.replace(
              /\\/g,
              "/"
            )}`}
            playing={isPlaying}
            volume={volume}
            onEnded={handleEnded}
            onProgress={handleProgress}
            progressInterval={100}
            width="100%"
            height="50px"
            controls={false}
          />
          <Slider
            min={0}
            max={100}
            value={played * 100}
            onChange={handleSeekChange}
            trackStyle={{ backgroundColor: "#ff0000" }}
            handleStyle={{ borderColor: "#ff0000" }}
          />
          <div className="player-controls">
            <button onClick={playPreviousSong}>
              <i className="fas fa-step-backward"></i>
            </button>
            <button onClick={togglePlay}>
              {isPlaying ? (
                <i className="fas fa-pause"></i>
              ) : (
                <i className="fas fa-play"></i>
              )}
            </button>
            <button onClick={playNextSong}>
              <i className="fas fa-step-forward"></i>
            </button>
            <button onClick={toggleShuffle}>
              {isShuffle ? (
                <i className="fas fa-random"></i>
              ) : (
                <i className="fas fa-retweet"></i>
              )}
            </button>
            <div className="volumeControl">
              <button onClick={() => setShowVolumeSlider(!showVolumeSlider)}>
                <i className="fas fa-volume-up"></i>
              </button>
              {showVolumeSlider && (
                <div className="volume-slider">
                  <Slider
                    min={0}
                    max={100}
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    trackStyle={{ backgroundColor: "#ff0000" }}
                    handleStyle={{ borderColor: "#ff0000" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
