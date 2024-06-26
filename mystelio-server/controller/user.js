// Joi is a powerful validation library for JavaScript and Node.js. It's commonly used for:
// Input Validation: Joi helps you validate and sanitize user input to ensure that it meets the expected criteria. This is crucial for preventing security vulnerabilities such as SQL injection or other forms of injection attacks.
// Schema Validation: Joi allows you to define a schema that specifies the expected shape and types of data. This helps ensure that your data adheres to a predefined structure.
// Error Handling: Joi provides detailed error messages when validation fails, making it easier to identify and address issues. These error messages can be sent back to clients for informative feedback.

const Joi = require("joi");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Set up storage for multer
const profilePicsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilepics/"); // Upload files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

exports.profilePicsUpload = multer({ storage: profilePicsStorage });

const userSchema = Joi.object({
  fullName: Joi.string().required(),
  userName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  birthDate: Joi.date().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string(),
  city: Joi.string(),
  profileImage: Joi.allow(),
});

exports.registerUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const em = req.body.email;
    if (await User.findOne({ where: { email: em } })) {
      return res.status(400).json({ error: "Email already in use!" });
    }
    const ph = req.body.phoneNumber;
    if (await User.findOne({ where: { phoneNumber: ph } })) {
      return res.status(400).json({ error: "Phone number already in use!" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let profileImageUrl = null;

    // Check if req.file exists before constructing the complete URL
    if (req.file) {
      profileImageUrl = req.file.path;
    }

    // Create a new user in the database
    const newUser = await User.create({
      fullName: req.body.fullName,
      username: req.body.userName,
      phoneNumber: req.body.phoneNumber,
      birthDate: req.body.birthDate,
      password: hashedPassword,
      email: req.body.email,
      country: req.body.country,
      city: req.body.city,
      profileImagePath: profileImageUrl, // Save the image path
    });
    res.status(201).json({ message: "Success" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login
// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.loginUser = async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "90d" } // Token expires in 90 days
    );

    // Set the JWT token as a cookie
    res.cookie("authToken", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    // Return user data (excluding password)
    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      email: user.email,
      country: user.country,
      city: user.city,
      creted_at: user.createdAt,
      updated_at: user.updatedAt,
      profileImage: user.profileImagePath,
      token: token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Fetch user with token
exports.fetchUserByToken = async (req, res) => {
  try {
    // Return user data (excluding password)
    res.status(200).json({
      success: "true",
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        username: req.user.username,
        phoneNumber: req.user.phoneNumber,
        birthDate: req.user.birthDate,
        email: req.user.email,
        country: req.user.country,
        city: req.user.city,
        creted_at: req.user.createdAt,
        updated_at: req.user.updatedAt,
        profileImage: req.user.profileImagePath,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Get users
exports.getUserWithPosts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user data in req.user after authentication

    // Find the user with the specified ID along with their posts
    const userWithPosts = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"], // Exclude the password field
      },
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "content", "createdAt", "likes"],
        },
      ],
    });

    res.status(200).json({ user: userWithPosts });
  } catch (error) {
    console.error("Error fetching user with posts:", error);
    res.status(500).json({
      message: "Error fetching user with posts",
      error: error.message,
    });
  }
};

// Get all users with their posts
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users along with their posts
    const allUsersWithPosts = await User.findAll({
      attributes: {
        exclude: ["password"], // Exclude the password field
      },
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "content", "createdAt", "likes"],
        },
      ],
    });

    res.status(200).json({ users: allUsersWithPosts });
  } catch (error) {
    console.error("Error fetching users with posts:", error);
    res.status(500).json({
      message: "Error fetching users with posts",
      error: error.message,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID along with their posts
    const userWithPosts = await User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password"], // Exclude the password field
      },
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "content", "createdAt", "likes"],
        },
      ],
    });

    if (!userWithPosts) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: userWithPosts });
  } catch (error) {
    console.error("Error fetching user with posts:", error);
    res.status(500).json({
      message: "Error fetching user with posts",
      error: error.message,
    });
  }
};
