const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  addPlaylist,
  playlistCoverUpload,
  getPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  songUpload,
  sharePlaylist,
  deletePlaylist,
  deleteSong,
} = require('./../controller/songs');

// Route to create a new playlist
router.post('/create', authMiddleware, playlistCoverUpload.single("coverImage"), addPlaylist);

// Route to get all playlists for the logged-in user
router.get('/my-playlists', authMiddleware, getPlaylists);

// Route to get a playlist by ID
router.get('/playlist/:playlistId', getPlaylistById);
router.delete('/playlist/:playlistId', authMiddleware, deletePlaylist);

// Route to add a song to a playlist
router.post('/add-song/:playlistId', authMiddleware, songUpload.single("audioFile"),addSongToPlaylist);
router.delete('/songs/:songId', authMiddleware, deleteSong);

// Route to share a playlist with a user
router.post('/share/:playlistId', authMiddleware, sharePlaylist);

module.exports = router;
