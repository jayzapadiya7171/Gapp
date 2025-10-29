import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import commentRoutes from "./routes/commentRoutes.js"

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",  // 👈 your frontend URL
    credentials: true,                // 👈 allow cookies / tokens
  })
);
app.use(express.json());

// ✅ Proper path handling
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.resolve();

// ✅ Serve static uploads from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/comments", commentRoutes);    
// ✅ Simple root check
app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
