const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/postModel");
const User = require("../models/userModel");

// Route to add a new post
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming you have user data in req.user after authentication

    // Create a new post
    const newPost = await Post.create({
      title,
      content,
      userId,
    });

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).send("Error adding post");
  }
});

// Route to retrieve all posts
router.get("/all", async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      attributes: ["id", "title", "content", "createdAt"],
      include: [
        // Include user information for each post
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send("Error retrieving posts");
  }
});

module.exports = router;
