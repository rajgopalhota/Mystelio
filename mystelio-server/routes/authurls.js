const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/userModel');
const express = require('express');
const router = express.Router();

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

router.post('/register', async (req, res) => {
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
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

module.exports = router;
