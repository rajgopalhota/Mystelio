const { DataTypes } = require("sequelize");
const db = require("../config/database");

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
  likes: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

module.exports = Post;
