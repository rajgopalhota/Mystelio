const express = require("express");
const router = express.Router();
const {
  registerUser,
  profilePicsUpload,
  loginUser,
} = require("../controller/user");
require("dotenv").config();

router.post(
  "/register",
  profilePicsUpload.single("profileImage"),
  registerUser
);

router.post("/login", loginUser);

module.exports = router;
