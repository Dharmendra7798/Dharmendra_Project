import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal } from '../features/cart/cartSelectors';
import { clearCart } from '../features/cart/cartSlice';
import { placeOrder, setOrderLoading, setOrderError } from '../features/order/orderSlice';
import { formatPrice } from '../utils/helpers';

import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Alert,
  CircularProgress,
  // ADDED MUI COMPONENTS
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment'; // ADDED ICON

// Array for payment options
const paymentOptions = [
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'PayPal', value: 'PayPal' },
    { label: 'Cash on Delivery (COD)', value: 'COD' },
];


// The URL for the backend API
const ORDER_API_URL = 'http://localhost:5000/api/orders';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value); // Default to Credit Card
  const [status, setStatus] = useState({ loading: false, error: null });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    dispatch(setOrderLoading());

    // 1. Construct the orderData object for the backend
    const customer = {
      name: shippingDetails.name,
      email: shippingDetails.email,
      address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}`, // Simple address concatenation
    };
    
    // Create a lean items list for storage in the DB
    const items = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    const orderData = {
      items: items,
      customer: customer,
      total: cartTotal,
      paymentMethod: paymentMethod, // Sending selected payment method to backend
    };

    try {
      // 2. Make the POST request to the backend API
      const response = await fetch(`${REACT_APP_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const savedOrder = await response.json();

      if (response.ok) {
        // 3. On Success
        dispatch(placeOrder(savedOrder)); // Store the saved order (with its _id)
        dispatch(clearCart()); // Clear the local cart state
        navigate('/order-confirmation'); // Navigate to confirmation page
      } else {
        // On Failure (4xx or 5xx status)
        const errorMessage = savedOrder.message || 'An unknown error occurred during order submission.';
        setStatus({ loading: false, error: errorMessage });
        dispatch(setOrderError(errorMessage));
      }
    } catch (error) {
      // Network or other error
      const errorMessage = 'Network error or connection failed. Ensure the backend is running on port 5000.';
      console.error('Checkout Error:', error);
      setStatus({ loading: false, error: errorMessage });
      dispatch(setOrderError(errorMessage));
    }
  };

  // Helper for checking form validity
  const isFormValid = shippingDetails.name && shippingDetails.email && shippingDetails.address && shippingDetails.city && shippingDetails.zip;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        🛒 Checkout
      </Typography>

      {status.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Order Submission Failed: {status.error}
        </Alert>
      )}

      <form onSubmit={handlePlaceOrder}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            {/* 1. Shipping Details */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                1. Shipping Details
              </Typography>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                required
                label="Address Line"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                margin="normal"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    label="City"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    label="Zip/Postal Code"
                    name="zip"
                    value={shippingDetails.zip}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* 2. Payment Method (Updated Section) */}
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ mr: 1 }} /> 2. Payment Method
              </Typography>
              
              <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
                <FormLabel component="legend">Select Payment Option (Simulation Only)</FormLabel>
                <RadioGroup
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handlePaymentChange}
                  sx={{ flexDirection: 'row', gap: 2 }} // Display horizontally
                >
                  {paymentOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              {/* Conditional Hint/Mock Input for Credit Card */}
              {paymentMethod === 'Credit Card' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Payment processing is simulated. In a real app, you would enter card details here.
                  </Alert>
              )}
              {paymentMethod === 'COD' && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    You chose Cash on Delivery. Please have the total amount ready upon arrival.
                  </Alert>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Order Summary */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="body1">Items: {cartItems.length}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Payment Method: {paymentMethod}
                </Typography>
                <Typography variant="body1">
                  Total (Incl. Shipping):
                </Typography>
                <Typography variant="h4" color="primary">
                  {formatPrice(cartTotal)}
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                disabled={status.loading || !isFormValid}
                sx={{ mt: 2, py: 1.5 }}
                startIcon={status.loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {status.loading ? 'Placing Order...' : `Place Order Now (${formatPrice(cartTotal)})`}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CheckoutPage;