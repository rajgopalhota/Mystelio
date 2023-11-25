const { DataTypes } = require("sequelize");
const db = require("../config/database");
const User = require("./userModel");

const Post = db.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  postImagePath: {
    type: DataTypes.STRING, // Store the path to the image file
  },
});

module.exports = Post;
