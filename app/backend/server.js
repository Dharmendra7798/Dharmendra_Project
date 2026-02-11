import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Import Routes
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],     credentials: true
}));
app.use(express.json()); // Body parser for JSON data

// --- Routes ---
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Sports Accessories API is running...');
});

// --- Database Connection ---
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully!');
    // Start the server only after successful database connection
    app.listen(process.env.PORT, () => {
      console.log(`Backend running at ${process.env.SERVER_URL}:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });