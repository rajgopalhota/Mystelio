// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "Please provide a valid token in the Authorization header.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the decoded ID
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    // Attach the user object to the request
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = authMiddleware;
