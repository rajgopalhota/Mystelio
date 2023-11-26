const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Comment = db.define("Comment", {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  replies: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

module.exports = Comment;
