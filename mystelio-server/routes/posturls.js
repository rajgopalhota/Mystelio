const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addPost, getPosts, getPostById, getLoggedInUserPosts, likePost, unlikePost, deletePost, updatePost, postPicUpload } = require("../controller/posts");

// Route to add a new post
router.post("/add", authMiddleware, postPicUpload.single("image"), addPost);

// Route to get posts for the logged-in user
router.get("/my-posts", authMiddleware, getLoggedInUserPosts);

// Route to retrieve posts based on id
router.get("/post/:postId", getPostById);

// Route to retrieve all posts
router.get("/all", getPosts);

// Like posts
router.get("/like/:postId", authMiddleware, likePost);

// Unlike posts
router.get("/unlike/:postId", authMiddleware, unlikePost);

// Route to delete a post
router.delete("/delete/:postId", authMiddleware, deletePost);

// Route to update a post
router.put("/update/:postId", authMiddleware, updatePost);

module.exports = router;
