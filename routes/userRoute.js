import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  userAuth,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/auth", userAuth);
router.post("/logout", userLogout);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
