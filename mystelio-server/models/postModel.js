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

// Add association to define the relationship between Post and User
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = Post;
