import { createSelector } from '@reduxjs/toolkit';

const selectCartItems = (state) => state.cart.items;

// Selectors
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectShippingCost = createSelector(
  [selectCartSubtotal],
  (subtotal) => (subtotal > 500 ? 0 : 10) // Free shipping over $500
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectShippingCost],
  (subtotal, shipping) => subtotal + shipping
);

export { selectCartItems };