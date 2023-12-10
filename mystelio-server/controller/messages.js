// messages.js (controller)

const { sequelize } = require("./../config/database");
const { Op } = require("sequelize");
const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

// Get conversations for the authenticated user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      include: [
        {
          model: User,
          as: "Users", // Use the correct alias here
          attributes: ["id", "username", "fullName"],
          through: { attributes: [] },
          where: { id: userId },
        },
      ],
    });

    res.json({ conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get messages from a specific conversation
exports.getSpecific = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: {
        conversationId,
        [sequelize.or]: [{ from: userId }, { to: userId }],
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "fromUser",
          attributes: ["id", "username", "fullName"],
        },
        {
          model: User,
          as: "toUser",
          attributes: ["id", "username", "fullName"],
        },
      ],
    });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Send a private message
exports.sendPvtMsg = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.toUserId;
    const { body } = req.body;

    // Find or create a conversation between the two users
    const [conversation] = await Conversation.findOrCreate({
      where: {
        '$id$': { [Op.in]: [fromUserId, toUserId] }
      },
      include: [
        {
          model: User,
          as: 'Users',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
    });

    // Create a message in the conversation
    const message = await Message.create({
      conversationId: conversation.id,
      from: fromUserId,
      to: toUserId,
      body,
    });

    // Update the lastMessage field in the Conversation model
    await conversation.update({ lastMessage: body });

    // Emit WebSocket event to notify the recipient about the new message
    // req.io
    //   .to(toUserId)
    //   .emit("newMessage", { conversationId: conversation.id, message });

    res.json({ message: "Message sent successfully", conversation, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
