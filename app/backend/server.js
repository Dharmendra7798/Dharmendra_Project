import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://mongo:27017/sportsdb";

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("Sports Accessories API running"));

mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
});
