const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.addPost = async (req, res) => {
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
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.getLoggedInUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find posts for the logged-in user
    const userPosts = await Post.findAll({
      where: { userId: userId },
      attributes: ["id", "title", "content", "createdAt", "likes"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    const postsWithLikes = await Promise.all(userPosts.map(async (post) => {
      const likesWithUserInfo = await Promise.all((post.likes || []).map(async (userId) => {
        const likedUser = await User.findByPk(userId, {
          attributes: ["id", "fullName", "email"],
        });
        return likedUser;
      }));

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        likes: likesWithUserInfo,
        created_user: post.user,
      };
    }));

    res.status(200).json({ posts: postsWithLikes });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      message: "Error fetching user posts",
      error: error.message,
    });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {

    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findByPk(postId, {
      attributes: ["id", "title", "content", "createdAt", "likes"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch likes with user information
    const likesWithUserInfo = await Promise.all((post.likes || []).map(async (userId) => {
      const likedUser = await User.findByPk(userId, {
        attributes: ["id", "fullName", "email"],
      });
      return likedUser;
    }));

    // Construct the response object
    const postWithLikes = {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      likes: likesWithUserInfo,
      created_user: post.user,
    };

    res.status(200).json({ post: postWithLikes });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};


exports.getPosts = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      attributes: ["id", "title", "content", "createdAt", "likes"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    const postsWithLikes = await Promise.all(allPosts.map(async (post) => {
      const likesWithUserInfo = await Promise.all((post.likes || []).map(async (userId) => {
        const likedUser = await User.findByPk(userId, {
          attributes: ["id", "fullName", "email"],
        });
        return likedUser;
      }));

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        likes: likesWithUserInfo,
        created_user: post.user
      };
    }));

    res.status(200).json({ posts: postsWithLikes });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

// Like and Dislikes
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Post already liked" });
    }

    // Add the user ID to the likes array
    post.likes = [...post.likes, userId]; // Change this line

    // Save the updated post
    try {
      await post.save();
      console.log("Post saved successfully");
      res.status(200).json({ message: "Post liked successfully", post: post });
    } catch (error) {
      console.error("Error saving post:", error);
      res
        .status(500)
        .json({ message: "Error saving post", error: error.message });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "Error liking post", error: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    // Remove the user ID from the likes array
    post.likes = post.likes.filter(id => id !== userId); // Change this line

    // Save the updated post
    try {
      await post.save();
      console.log("Post saved successfully");
      res.status(200).json({ message: "Post unliked successfully", post: post });
    } catch (error) {
      console.error("Error saving post:", error);
      res
        .status(500)
        .json({ message: "Error saving post", error: error.message });
    }
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "Error unliking post", error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Find the post
    const post = await Post.findByPk(postId);

    // Check if the post exists
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    // Check if the authenticated user is the owner of the post
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    // Delete the post
    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};
