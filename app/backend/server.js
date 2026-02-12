import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Load env (works locally; in Docker env comes from docker-compose)
dotenv.config();

// Routes
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Support both env names + docker fallback
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://mongo:27017/sportsdb"; // docker-compose service name

// --- Middleware ---
app.use(
  cors({
    origin: "*", // change later for prod domain
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// --- Routes ---
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Sports Accessories API is running...");
});

// --- Database Connection ---
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected successfully!");

    // 🔥 IMPORTANT FIX (bind to all interfaces)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on 0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
