const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Comment = require("./commentModel");

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
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  likes: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

module.exports = Post;
