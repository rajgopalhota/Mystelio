// playlistModel.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Playlist = db.define("Playlist", {
  playlistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sharedWith: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  albumCover: {
    type: DataTypes.STRING, // Store the path to the image file
  },
});

// Add association for Playlist and Song
const Song = require("./songModel");
Playlist.hasMany(Song, { foreignKey: "playlistId", as: "songs" });
Song.belongsTo(Playlist, { foreignKey: "playlistId", as: "playlist" });

module.exports = Playlist;
