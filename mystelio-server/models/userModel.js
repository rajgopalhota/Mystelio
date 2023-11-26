const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Post = require("./postModel");
const Comment = require("./commentModel");

const User = db.define("User", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  country: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  profileImagePath: {
    type: DataTypes.STRING, // Store the path to the image file
  },
  followers: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  following: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});
// userModel.js

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
// onDelete cascade makes if user deletes his posts also gets deleted!
// User.hasMany(Post, { foreignKey: "userId", as: "posts", onDelete: "CASCADE"});
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

module.exports = User;
