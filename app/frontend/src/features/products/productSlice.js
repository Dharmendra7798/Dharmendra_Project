import { createSlice } from '@reduxjs/toolkit';
import { products } from '../../data/products';

const initialState = {
  items: products, // The local product catalog
  categoryFilter: 'All Products',
  sortOrder: 'default', // default, price-asc, price-desc, rating-desc
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      state.searchQuery = ''; // Clear search when changing category
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.toLowerCase();
      state.categoryFilter = 'All Products'; // Clear category filter when searching
    },
  },
});

export const { setCategoryFilter, setSortOrder, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;