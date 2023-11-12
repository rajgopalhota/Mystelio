const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const router = express.Router();
require('dotenv').config();


// Joi is a powerful validation library for JavaScript and Node.js. It's commonly used for:
// Input Validation: Joi helps you validate and sanitize user input to ensure that it meets the expected criteria. This is crucial for preventing security vulnerabilities such as SQL injection or other forms of injection attacks.
// Schema Validation: Joi allows you to define a schema that specifies the expected shape and types of data. This helps ensure that your data adheres to a predefined structure.
// Error Handling: Joi provides detailed error messages when validation fails, making it easier to identify and address issues. These error messages can be sent back to clients for informative feedback.

const userSchema = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  birthDate: Joi.date().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string(),
  city: Joi.string(),
});

router.post("/register", async (req, res) => {
  try {
    // Validate user input
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      birthDate: req.body.birthDate,
      password: hashedPassword,
      email: req.body.email,
      country: req.body.country,
      city: req.body.city,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/login", async (req, res) => {
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
    console.log("hellooooooooooo", process.env.JWT_SECRET)
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return JWT token and user data (excluding password)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate,
        email: user.email,
        country: user.country,
        city: user.city,
        creted_at: user.createdAt,
        updated_at:user.updatedAt
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
});

module.exports = router;
