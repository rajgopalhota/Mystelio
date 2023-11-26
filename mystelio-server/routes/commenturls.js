const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addComment, addReply } = require("../controller/comments");

router.post("/add/:postId", authMiddleware, addComment);
router.post("/reply/:commentId", authMiddleware, addReply);

module.exports = router;