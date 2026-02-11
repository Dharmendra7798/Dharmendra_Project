import { createSelector } from '@reduxjs/toolkit';

const selectOrderState = (state) => state.order;

export const selectCurrentOrder = createSelector(
    [selectOrderState],
    (orderState) => orderState.order
);