// messages.js (controller)

const { Op } = require("sequelize");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

// Get conversations for the authenticated user
exports.getConversations = async (req, res) => {
  try {

    const userId = req.user.id;
    // Find all messages involving the authenticated user
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
      },
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
      order: [["createdAt", "DESC"]],
    });

    // Group messages by conversation
    const conversations = {};
    messages.forEach((message) => {
      const conversationId = message.conversationId;
      if (!conversations[conversationId]) {
        conversations[conversationId] = message;
      } else if (message.createdAt > conversations[conversationId].createdAt) {
        conversations[conversationId] = message;
      }
    });

    // Convert conversations object to array
    const conversationsArray = Object.values(conversations);

    res.json(conversationsArray);
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
        [Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
        conversationId
      },
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
      order: [["createdAt", "ASC"]],
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

    let message;

    // Check if a conversation already exists
    const existingConversation = await Message.findOne({
      where: {
        [Op.or]: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
        isConversationStart: true,
      },
    });

    if (existingConversation) {
      // Conversation already exists, add a new message to it
      message = await Message.create({
        fromUserId,
        toUserId,
        body,
        conversationId: existingConversation.conversationId,
      });
    } else {
      // Conversation doesn't exist, create a new conversation and add the message
      const newConversation = await Message.create({
        fromUserId,
        toUserId,
        body,
        isConversationStart: true,
      });

      // Set the conversationId to the id of the new message
      newConversation.conversationId = newConversation.id;
      await newConversation.save();

      message = newConversation;
    }
    // Emit the new message to connected clients
    req.io.emit("newMessage", {
      conversationId: message.conversationId,
      message: {
        id: message.id,
        body: message.body,
        fromUserId: message.fromUserId,
        toUserId: message.toUserId,
        createdAt: message.createdAt,
      },
    });
    res.json({
      message: "Message sent successfully",
      conversationId: message.conversationId,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};