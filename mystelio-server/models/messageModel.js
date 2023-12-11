// messageModel.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Message = db.define("Message", {
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  conversationId: {
    type: DataTypes.INTEGER,
  },
  isConversationStart: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Message;
