import Photo from "../models/photoModel.js";
import fs from "fs";
import path from "path";

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const photo = new Photo({
      title: req.body.title || "Untitled",
      image: `/uploads/${req.file.filename}`,
      user: req.user._id,
    });

    const createdPhoto = await photo.save();
    res.status(201).json(createdPhoto);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().populate("user", "name email");
    res.json(photos);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    if (photo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Delete image file
    const filePath = path.join(process.cwd(), photo.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await photo.deleteOne();
    res.json({ message: "Photo deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting photo" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    const userId = req.user._id;
    const alreadyLiked = photo.likes.includes(userId);

    if (alreadyLiked) {
      photo.likes = photo.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      photo.likes.push(userId);
    }

    await photo.save();
    res.json(photo);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};
