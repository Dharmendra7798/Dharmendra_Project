import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, name, price, quantity, imageUrl }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { id, name, price, imageUrl, stock } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Increment quantity, respecting stock limit
        existingItem.quantity = Math.min(
          existingItem.quantity + 1,
          stock || existingItem.quantity + 1
        );
      } else {
        // Add new item
        state.items.push({ id, name, price, imageUrl, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload); // payload is product id
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;