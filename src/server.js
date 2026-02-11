import dns from "dns";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";

// Set DNS servers to resolve MongoDB Atlas connection issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Quota Backend API running" });
});

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
