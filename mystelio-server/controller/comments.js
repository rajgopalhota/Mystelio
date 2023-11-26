const Comment = require("../models/commentModel");
const User = require("../models/userModel");

exports.addComment = async (req, res) => {
  try {
    const { comment, replies } = req.body;
    const userId = req.user.id;
    const postId = req.params.postId;

    // Create a new comment
    const newComment = await Comment.create({
      comment,
      replies,
      userId,
      postId,
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { reply } = req.body;

    // Find the comment
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Fetch user information for the reply
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "profileImagePath"],
    });

    const newReply = {
      user,
      reply,
      createdAt: new Date(),
    };

    // Add the reply
    comment.replies = [...(comment.replies || []), newReply];

    // Save the updated comment
    await comment.save();

    res
      .status(201)
      .json({ message: "Reply added successfully", reply: newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
};
