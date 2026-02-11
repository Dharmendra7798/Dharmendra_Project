import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order: null, // Holds the full order object returned by the backend
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // This reducer is dispatched on successful POST to the backend
    placeOrder: (state, action) => {
      // The payload is the saved order object from the backend, containing _id
      state.order = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setOrderLoading: (state) => {
        state.isLoading = true;
        state.error = null;
    },
    setOrderError: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    },
    clearOrder: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { placeOrder, setOrderLoading, setOrderError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;