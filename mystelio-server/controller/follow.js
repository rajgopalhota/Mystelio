const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

// follow a person
exports.follow = async (req, res) => {
  try {
    const followerId = req.user.id; // Follower user ID from token
    const followingId = req.params.userId; // User ID to follow

    if (followerId == followingId) {
      return res.status(404).json({ message: "You can't follow yourself!" });
    }

    // Check if the user to follow exists
    const followingUser = await User.findByPk(followingId);

    if (!followingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the follower is not trying to follow themselves
    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if the follower is already following the user
    if (followingUser.followers.includes(followerId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Update the follower and following lists
    followingUser.followers = [...followingUser.followers, followerId];
    const followerUser = await User.findByPk(followerId);
    followerUser.following = [...followerUser.following, followingId];

    // Save the updated users
    await followingUser.save();
    await followerUser.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
};

// unfollow a person
exports.unFollow = async (req, res) => {
  try {
    const followerId = req.user.id; // Follower user ID from token
    const followingId = req.params.userId; // User ID to unfollow

    if (followerId == followingId) {
      return res.status(404).json({ message: "You can't unfollow yourself!" });
    }
    // Check if the user to unfollow exists
    const followingUser = await User.findByPk(followingId);

    if (!followingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the follower is not trying to unfollow themselves
    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot unfollow yourself" });
    }

    // Check if the follower is already not following the user
    if (!followingUser.followers.includes(followerId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Update the follower and following lists
    followingUser.followers = followingUser.followers.filter(
      (id) => id !== followerId
    );
    const followerUser = await User.findByPk(followerId);
    followerUser.following = followerUser.following.filter(
      (id) => id !== followingId
    );

    // Save the updated users
    await followingUser.save();
    await followerUser.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
};

// get friends list (following list)
exports.getFollowingList = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email", "followers", "following"],
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "content", "createdAt", "likes"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersList = await User.findAll({
      where: { id: user.followers },
      attributes: ["id", "fullName", "email"],
    });

    res.status(200).json({ followersList: followersList });
  } catch (error) {
    console.error("Error getting following list:", error);
    res.status(500).json({
      message: "Error getting following list",
      error: error.message,
    });
  }
};

// get followers list
exports.getFollowersList = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email", "followers", "following"],
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "content", "createdAt", "likes"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingList = await User.findAll({
      where: { id: user.following },
      attributes: ["id", "fullName", "email"],
    });

    res.status(200).json({ followingList: followingList });
  } catch (error) {
    console.error("Error getting followers list:", error);
    res.status(500).json({
      message: "Error getting followers list",
      error: error.message,
    });
  }
};

// get friends posts
const fetchLikesWithUserInfo = async (likes) => {
  return Promise.all(
    (likes || []).map(async (userId) => {
      const likedUser = await User.findByPk(userId, {
        attributes: ["id", "fullName", "email"],
      });
      return likedUser;
    })
  );
};
const fetchPostsWithInfo = async (posts) => {
  return Promise.all(
    posts.map(async (post) => {
      const likesWithUserInfo = await fetchLikesWithUserInfo(post.likes);
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        likes: likesWithUserInfo,
        created_user: post.user,
        comments: post.comments,
      };
    })
  );
};

exports.getFriendsPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email", "following"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts from friends
    const friendsPosts = await Post.findAll({
      where: { userId: user.following },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "comment", "replies", "userId"],
          include: [
            {
              model: User,
              as: "user", // Match the alias used in the association
              attributes: ["id", "fullName", "profileImagePath"],
            },
          ],
        },
      ],
    });

    // Get posts from the logged-in user
    const userPosts = await Post.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    // Combine and sort posts
    const allPosts = [...friendsPosts, ...userPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const postsWithLikes = await fetchPostsWithInfo(allPosts);

    res.status(200).json({ friendsPosts: postsWithLikes });
  } catch (error) {
    console.error("Error getting friends' and user's posts:", error);
    res.status(500).json({
      message: "Error getting friends' and user's posts",
      error: error.message,
    });
  }
};
