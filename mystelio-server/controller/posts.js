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

const fetchUserInfo = async (userId) => {
  return User.findByPk(userId, {
    attributes: ["id", "fullName", "username", "email", "profileImagePath"],
  });
};

const fetchLikesWithUserInfo = async (likes) => {
  return Promise.all((likes || []).map(fetchUserInfo));
};

const addPostInfo = async (post) => {
  try {
    const populatedPost = await Post.findByPk(post.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "username", "email", "profileImagePath"] },
        { model: Comment, as: "comments", include: [{ model: User, as: "user", attributes: ["id", "fullName", "username", "profileImagePath"] }] },
      ],
    });

    const likesWithUserInfo = await fetchLikesWithUserInfo(populatedPost.likes);

    return {
      id: populatedPost.id,
      title: populatedPost.title,
      content: populatedPost.content,
      postImagePath: populatedPost.postImagePath,
      tags: populatedPost.tags,
      createdAt: populatedPost.createdAt,
      likes: likesWithUserInfo,
      created_user: populatedPost.user,
      comments: populatedPost.comments,
    };
  } catch (error) {
    console.error("Error fetching post with info:", error);
    throw error;
  }
};

const fetchPostsWithInfo = async (posts) => {
  return Promise.all(posts.map(async (post) => {
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
  }));
};

const handleErrorResponse = (res, statusCode, message, error) => {
  console.error(message, error);
  res.status(statusCode).json({ message, error: error.message });
};

exports.addPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postImageUrl = req.file ? req.file.path : null;

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      postImagePath: postImageUrl,
      tags: req.body.tags,
      userId,
    });

    const postWithInfo = await addPostInfo(newPost);
    console.log(postWithInfo);
    res.status(201).json({ message: "Post added successfully", post: postWithInfo });
  } catch (error) {
    handleErrorResponse(res, 500, "Error adding post", error);
  }
};

exports.getLoggedInUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPosts = await Post.findAll({
      where: { userId },
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "username", "email", "profileImagePath"] },
        { model: Comment, as: "comments", include: [{ model: User, as: "user", attributes: ["id", "fullName", "username", "profileImagePath"] }] },
      ],
    });

    const postsWithLikes = await fetchPostsWithInfo(userPosts);

    res.status(200).json({ posts: postsWithLikes.reverse() });
  } catch (error) {
    handleErrorResponse(res, 500, "Error fetching user posts", error);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId, {
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "username", "email", "profileImagePath"] },
        { model: Comment, as: "comments", include: [{ model: User, as: "user", attributes: ["id", "fullName", "username", "profileImagePath"] }] },
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
    handleErrorResponse(res, 500, "Error fetching post", error);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "username", "email", "profileImagePath"] },
        { model: Comment, as: "comments", include: [{ model: User, as: "user", attributes: ["id", "fullName", "username", "profileImagePath"] }] },
      ],
    });

    const postsWithLikes = await fetchPostsWithInfo(allPosts);

    res.status(200).json({ posts: postsWithLikes.reverse() });
  } catch (error) {
    handleErrorResponse(res, 500, "Error fetching posts", error);
  }
};

const likeOrUnlikePost = async (req, res, isLike) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if ((isLike && isLiked) || (!isLike && !isLiked)) {
      const action = isLike ? "like" : "unlike";
      return res.status(400).json({ message: `Post already ${action}d` });
    }

    if (isLike) {
      post.likes = [...post.likes, userId];
    } else {
      post.likes = post.likes.filter((id) => id !== userId);
    }

    try {
      await post.save();
      const action = isLike ? "liked" : "unliked";
      res.status(200).json({ message: `Post ${action} successfully`, post });
    } catch (error) {
      handleErrorResponse(res, 500, "Error saving post", error);
    }
  } catch (error) {
    const action = isLike ? "liking" : "unliking";
    handleErrorResponse(res, 500, `Error ${action} post`, error);
  }
};

exports.likePost = async (req, res) => {
  likeOrUnlikePost(req, res, true);
};

exports.unlikePost = async (req, res) => {
  likeOrUnlikePost(req, res, false);
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, 500, "Error deleting post", error);
  }
};

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
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    handleErrorResponse(res, 500, "Error updating post", error);
  }
};
