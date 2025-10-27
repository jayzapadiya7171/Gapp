import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Proper path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static uploads from backend/uploads
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);

// ✅ Simple root check
app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
