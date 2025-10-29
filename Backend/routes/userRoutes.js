import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
