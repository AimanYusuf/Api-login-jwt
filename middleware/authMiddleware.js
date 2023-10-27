import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.userId);

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Access denied,token expired");
    }
  } else {
    res.status(401);
    throw new Error("Access denied , no token");
  }
});

export default protect;
