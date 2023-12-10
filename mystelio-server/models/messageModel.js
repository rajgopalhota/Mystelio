// messageModel.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Message = db.define("Message", {
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Message;
