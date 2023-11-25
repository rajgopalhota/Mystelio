const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addPost, getPosts, getUserWithPosts } = require("../controller/posts");

// Route to add a new post
router.post("/add", authMiddleware, addPost);

// Route to retrieve all posts
router.get("/all", getPosts);

router.get("/user-with-posts",authMiddleware, getUserWithPosts);

module.exports = router;
