const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { follow, unFollow, getFollowersList, getFollowingList, getFriendsPosts } = require("../controller/follow");

router.post("/follow/:userId", authMiddleware, follow)
router.post("/unfollow/:userId", authMiddleware, unFollow)
router.get("/followersList", authMiddleware, getFollowersList)
router.get("/followingList", authMiddleware, getFollowingList)
router.get("/getFriendsPosts", authMiddleware, getFriendsPosts)

module.exports = router;