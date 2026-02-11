// Helper function to format price as USD currency
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Simple ID generator for cart items (for local use)
export const generateId = () => Math.random().toString(36).substring(2, 9);