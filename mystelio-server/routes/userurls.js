const express = require("express");
const router = express.Router();
const {
  registerUser,
  profilePicsUpload,
  loginUser,
  getUserWithPosts,
  getAllUsers,
  getSingleUser
} = require("../controller/user");
require("dotenv").config();
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/register",
  profilePicsUpload.single("profileImage"),
  registerUser
);

router.post("/login", loginUser);

router.get("/user-with-posts",authMiddleware, getUserWithPosts);

router.get("/fetch-user", authMiddleware, )

router.get("/user/:userId", getSingleUser);

router.get("/allusers", getAllUsers);

module.exports = router;
