import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// desc     User registration
// route    POST "/api/user/register"
// access   Public
export const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  const userExsits = await User.findOne({ email });

  if (userExsits) {
    res.status(401);
    throw new Error("User already exsits");
  } else if (password !== confPassword) {
    res.status(401);
    throw new Error("Password and confirm password do not match");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      message: "User created successfuly",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(500);
    throw new Error("Something went worng");
  }
});

// desc     User authenticate
// route    POST "/api/user/auth"
// access   Public
export const userAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      message: "Login successfuly",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(500);
    throw new Error("invalid email or password");
  }
});

// desc     User logout
// route    POST "/api/user/logout"
// access   Private
export const userLogout = asyncHandler(async (req, res) => {
  if (!req.cookies.jwt) {
    res.status(500);
    throw new Error("Access denied no token");
  }

  res.cookie("jwt", "", { maxAge: new Date(0) });
  res.json({ message: "Logout successfuly" });
});

// desc     Get user profile
// route    GET "/api/user/profile"
// access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// desc     Update user profile
// route    PUT "/api/user/profile"
// access   Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfuly",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
