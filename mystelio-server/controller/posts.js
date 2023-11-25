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

exports.getPosts = async (req, res) => {
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
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.getUserWithPosts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user data in req.user after authentication

    // Find the user with the specified ID along with their posts
    const userWithPosts = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email"],
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "content", "createdAt"],
        },
      ],
    });

    res.status(200).json({ user: userWithPosts });
  } catch (error) {
    console.error("Error fetching user with posts:", error);
    res
      .status(500)
      .json({
        message: "Error fetching user with posts",
        error: error.message,
      });
  }
};
