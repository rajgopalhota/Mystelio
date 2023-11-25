const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addPost, getPosts, getUserWithPosts, likePost, unlikePost } = require("../controller/posts");

// Route to add a new post
router.post("/add", authMiddleware, addPost);

// Route to retrieve all posts
router.get("/all", getPosts);

// Like posts
router.post("/like/:postId", authMiddleware, likePost);

// Unlike posts
router.post("/unlike/:postId", authMiddleware, unlikePost);

router.get("/user-with-posts",authMiddleware, getUserWithPosts);

module.exports = router;
