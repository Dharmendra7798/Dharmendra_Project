import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // The items array will store a copy of the cart contents
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    // Customer/Shipping details
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true }, // Simple string for the full address
    },
    // The total price of the order
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;