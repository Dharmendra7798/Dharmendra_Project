import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public (The checkout integration point)
router.post('/', async (req, res) => {
  const { items, customer, total } = req.body;

  // Simple validation
  if (!items || !customer || !total) {
    return res.status(400).json({ message: 'Missing required order fields: items, customer, or total.' });
  }

  try {
    const order = new Order({
      items,
      customer,
      total,
    });

    const savedOrder = await order.save();

    // Crucial: Respond with the complete saved order (including the new _id)
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Fetch all orders (For debugging/admin)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;