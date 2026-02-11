import { createSelector } from '@reduxjs/toolkit';

// Basic Selectors
const selectProductState = (state) => state.products;

const selectProducts = createSelector(
  [selectProductState],
  (productsState) => productsState.items
);

const selectCategoryFilter = createSelector(
  [selectProductState],
  (productsState) => productsState.categoryFilter
);

const selectSortOrder = createSelector(
  [selectProductState],
  (productsState) => productsState.sortOrder
);

const selectSearchQuery = createSelector(
  [selectProductState],
  (productsState) => productsState.searchQuery
);

// Memoized Selector for Filtered and Sorted Products
export const selectFilteredAndSortedProducts = createSelector(
  [selectProducts, selectCategoryFilter, selectSortOrder, selectSearchQuery],
  (products, categoryFilter, sortOrder, searchQuery) => {
    let filteredProducts = [...products];

    // 1. Filter by Category
    if (categoryFilter !== 'All Products') {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === categoryFilter
      );
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // 3. Sort
    switch (sortOrder) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'default':
      default:
        // Keep original order
        break;
    }

    return filteredProducts;
  }
);

// Selector to get product by ID
export const selectProductById = (productId) =>
  createSelector([selectProducts], (products) =>
    products.find((p) => p.id === productId)
  );

export { selectCategoryFilter, selectSortOrder, selectSearchQuery };