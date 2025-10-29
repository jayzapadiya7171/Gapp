import Comment from "../models/comment.js";
import Photo from "../models/photoModel.js";

export const addComment = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    const comment = await Comment.create({
      photo: photoId,
      user: userId,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { photoId } = req.params;
    const comments = await Comment.find({ photo: photoId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
