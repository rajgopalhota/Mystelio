// songModel.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Song = db.define("Song", {
  songName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  audioPath: {
    type: DataTypes.STRING, // Store the path to the audio file
    allowNull: false,
  },
  // Add other fields for the song model as needed
});

module.exports = Song;
