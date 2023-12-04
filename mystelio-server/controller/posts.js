const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const path = require("path");
const multer = require("multer");

// Set up storage for multer
const postsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/"); // Upload files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

exports.postPicUpload = multer({ storage: postsStorage });

// Function to fetch likes with user information
const fetchLikesWithUserInfo = async (likes) => {
  return Promise.all(
    (likes || []).map(async (userId) => {
      const likedUser = await User.findByPk(userId, {
        attributes: ["id", "fullName", "email", "profileImagePath"],
      });
      return likedUser;
    })
  );
};

// Create a new post
exports.addPost = async (req, res) => {
  try {
    const userId = req.user.id;

    let postImageUrl = null;

    // Check if req.file exists before constructing the complete URL
    if (req.file) {
      postImageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      postImagePath: postImageUrl,
      tags: req.body.tags,
      userId
    });

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    console.error("Error adding post:", error);
    res
      .status(500)
      .json({ message: "Error adding post", error: error.message });
  }
};

// Fetch posts with user and likes information
const fetchPostsWithInfo = async (posts) => {
  return Promise.all(
    posts.map(async (post) => {
      const likesWithUserInfo = await fetchLikesWithUserInfo(post.likes);
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        postImagePath: post.postImagePath,
        tags: post.tags,
        createdAt: post.createdAt,
        likes: likesWithUserInfo,
        created_user: post.user,
        comments: post.comments,
      };
    })
  );
};

// Fetch posts for the logged-in user
exports.getLoggedInUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPosts = await Post.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "profileImagePath"],
        },
        {
          model: Comment,
          as: "comments",
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

    const postsWithLikes = await fetchPostsWithInfo(userPosts);

    res.status(200).json({ posts: postsWithLikes.reverse() });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res
      .status(500)
      .json({ message: "Error fetching user posts", error: error.message });
  }
};

// Fetch a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "profileImagePath"],
        },
        {
          model: Comment,
          as: "comments",
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

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likesWithUserInfo = await fetchLikesWithUserInfo(post.likes);

    const postWithLikes = {
      id: post.id,
      title: post.title,
      content: post.content,
      postImagePath: post.postImagePath,
      tags: post.tags,
      createdAt: post.createdAt,
      likes: likesWithUserInfo,
      created_user: post.user,
      comments: post.comments,
    };

    res.status(200).json({ post: postWithLikes });
  } catch (error) {
    console.error("Error fetching post:", error);
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

// Fetch all posts with user and likes information
exports.getPosts = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "profileImagePath"],
        },
        {
          model: Comment,
          as: "comments",
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

    const postsWithLikes = await fetchPostsWithInfo(allPosts);

    res.status(200).json({ posts: postsWithLikes.reverse() });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes = [...post.likes, userId];

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

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    post.likes = post.likes.filter((id) => id !== userId);

    try {
      await post.save();
      console.log("Post saved successfully");
      res
        .status(200)
        .json({ message: "Post unliked successfully", post: post });
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

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { title, content } = req.body;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post: post });
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};
