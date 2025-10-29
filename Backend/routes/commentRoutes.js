import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:photoId", protect, addComment); // Add a comment
router.get("/:photoId", getComments);           // Get comments for a photo

export default router;
