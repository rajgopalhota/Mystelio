const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");
const {
  getConversations,
  getSpecific,
  sendPvtMsg,
} = require("../controller/messages");

// Get conversations for the authenticated user
router.get("/conversations", isAuthenticated, getConversations);

// Get messages from a specific conversation
router.get(
  "/:conversationId/messages",
  isAuthenticated,
  getSpecific
);

// Send a private message
router.post("/:toUserId", isAuthenticated, sendPvtMsg);

module.exports = router;
