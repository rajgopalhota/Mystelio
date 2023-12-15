// controllers/playlists.js
const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");
const User = require("../models/userModel");
const multer = require("multer");
const path = require('path');

// Set up storage for playlist covers
const playlistCoversStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/playlists/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Set up storage for songs
const songsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/songs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

exports.songUpload = multer({ storage: songsStorage });

exports.playlistCoverUpload = multer({ storage: playlistCoversStorage });

// Create a new playlist
exports.addPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    let playlistCoverUrl = null;

    // Check if req.file exists before constructing the complete URL
    if (req.file) {
      playlistCoverUrl = req.file.path;
    }

    const newPlaylist = await Playlist.create({
      playlistName: req.body.playlistName,
      albumCover: playlistCoverUrl,
      createdUserId: userId,
    });

    res
      .status(201)
      .json({ message: "Playlist added successfully", playlist: newPlaylist });
  } catch (error) {
    console.error("Error adding playlist:", error);
    res
      .status(500)
      .json({ message: "Error adding playlist", error: error.message });
  }
};

// Get all playlists for the logged-in user
exports.getPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPlaylists = await Playlist.findAll({
      where: { createdUserId: userId },
      include: [
        {
          model: User,
          as: "createdUser",
          attributes: [
            "id",
            "fullName",
            "username",
            "email",
            "profileImagePath",
          ],
        },
        {
          model: Song,
          as: "songs",
        },
      ],
    });

    res.status(200).json({ playlists: userPlaylists });
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    res
      .status(500)
      .json({ message: "Error fetching user playlists", error: error.message });
  }
};

// Get a playlist by ID
exports.getPlaylistById = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findByPk(playlistId, {
      include: [
        {
          model: User,
          as: "createdUser",
          attributes: [
            "id",
            "fullName",
            "username",
            "email",
            "profileImagePath",
          ],
        },
        {
          model: Song,
          as: "songs",
        },
      ],
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ playlist });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res
      .status(500)
      .json({ message: "Error fetching playlist", error: error.message });
  }
};

// Add a new song to a playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;

    let audioFilePath = null;

    // Check if req.file exists before constructing the complete URL
    if (req.file) {
      audioFilePath = req.file.path;
    }

    const newSong = await Song.create({
      songName: req.body.songName,
      audioPath: audioFilePath,
      playlistId,
    });

    res
      .status(201)
      .json({ message: "Song added to playlist successfully", song: newSong });
  } catch (error) {
    console.error("Error adding song:", error);
    res
      .status(500)
      .json({ message: "Error adding song", error: error.message });
  }
};

// Share a playlist with a user
exports.sharePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userIdToShareWith = req.body.userId;

    // Check if the logged-in user is the creator of the playlist
    const playlist = await Playlist.findOne({
      where: { id: playlistId, createdUserId: req.user.id },
    });

    if (!playlist) {
      return res
        .status(403)
        .json({ message: "Unauthorized to share this playlist" });
    }

    // Check if the user to share with exists
    const userToShareWith = await User.findByPk(userIdToShareWith);
    if (!userToShareWith) {
      return res.status(404).json({ message: "User to share with not found" });
    }

    // Use Sequelize's update method to add userIdToShareWith to sharedWith
    await playlist.update({
      sharedWith: [
        ...new Set([...(playlist.sharedWith || []), userIdToShareWith]),
      ],
    });

    res.status(200).json({ message: "Playlist shared successfully", playlist });
  } catch (error) {
    console.error("Error sharing playlist:", error);
    res
      .status(500)
      .json({ message: "Error sharing playlist", error: error.message });
  }
};

// Delete a playlist and its associated songs
exports.deletePlaylist = async (req, res) => {
  try {
    
    const playlistId = req.params.playlistId;

    // Find the playlist
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    
    if (playlist.createdUserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this playlist" });
    }

    // Delete the playlist and its associated songs
    await Promise.all([
      playlist.destroy(), // Delete the playlist
      Song.destroy({ where: { playlistId } }), // Delete songs associated with the playlist
    ]);

    res
      .status(200)
      .json({ message: "Playlist and associated songs deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist and songs:", error);
    res.status(500).json({
      message: "Error deleting playlist and songs",
      error: error.message,
    });
  }
};

// Delete a song
exports.deleteSong = async (req, res) => {
  try {
    const songId = req.params.songId;

    // Find the song
    const song = await Song.findByPk(songId);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    // Check if the logged-in user is the creator of the playlist containing the song
    const playlist = await Playlist.findByPk(song.playlistId);
    console.log(req.user.id)
    if (!playlist || playlist.createdUserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this song" });
    }
    await song.destroy();

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    res
      .status(500)
      .json({ message: "Error deleting song", error: error.message });
  }
};
