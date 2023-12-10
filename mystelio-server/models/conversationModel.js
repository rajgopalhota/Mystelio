// conversationModel.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Conversation = db.define("Conversation", {
  lastMessage: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Conversation;
