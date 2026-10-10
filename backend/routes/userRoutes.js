const express = require("express");
const User = require("../models/user");

const router = express.Router();

// ================= SIGN UP =================

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Failed to create account",
      error: error.message,
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN REQUEST RECEIVED");

    const { email, password } = req.body;

    console.log("Email:", email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    console.log("User found:", user ? user.email : "NO USER");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("LOGIN SUCCESS");

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// ================= TEST =================

router.get("/test", (req, res) => {
  res.json({
    message: "User routes are working!",
  });
});

module.exports = router;