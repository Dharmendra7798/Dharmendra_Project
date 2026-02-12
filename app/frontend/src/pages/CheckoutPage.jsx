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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

const paymentOptions = [
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'PayPal', value: 'PayPal' },
  { label: 'Cash on Delivery (COD)', value: 'COD' },
];

// ✅ PROD FIX: Backend URL (EC2 public IP fallback)
const API_URL =
  process.env.REACT_APP_API_URL || "http://65.1.18.39:5000";

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

  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value);
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

    const customer = {
      name: shippingDetails.name,
      email: shippingDetails.email,
      address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}`,
    };

    const items = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      items,
      customer,
      total: cartTotal,
      paymentMethod,
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const savedOrder = await response.json();

      if (response.ok) {
        dispatch(placeOrder(savedOrder));
        dispatch(clearCart());
        navigate('/order-confirmation');
      } else {
        const errorMessage =
          savedOrder?.message || 'Order submission failed.';
        setStatus({ loading: false, error: errorMessage });
        dispatch(setOrderError(errorMessage));
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      setStatus({ loading: false, error: 'Backend not reachable' });
      dispatch(setOrderError('Backend not reachable'));
    }
  };

  const isFormValid =
    shippingDetails.name &&
    shippingDetails.email &&
    shippingDetails.address &&
    shippingDetails.city &&
    shippingDetails.zip;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        🛒 Checkout
      </Typography>

      {status.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {status.error}
        </Alert>
      )}

      <form onSubmit={handlePlaceOrder}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                1. Shipping Details
              </Typography>

              <TextField fullWidth required label="Full Name" name="name" value={shippingDetails.name} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth required label="Email" name="email" type="email" value={shippingDetails.email} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth required label="Address Line" name="address" value={shippingDetails.address} onChange={handleInputChange} margin="normal" />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth required label="City" name="city" value={shippingDetails.city} onChange={handleInputChange} margin="normal" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth required label="Zip/Postal Code" name="zip" value={shippingDetails.zip} onChange={handleInputChange} margin="normal" />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ mr: 1 }} /> 2. Payment Method
              </Typography>

              <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
                <FormLabel>Select Payment Option</FormLabel>
                <RadioGroup name="paymentMethod" value={paymentMethod} onChange={handlePaymentChange} sx={{ flexDirection: 'row', gap: 2 }}>
                  {paymentOptions.map((option) => (
                    <FormControlLabel key={option.value} value={option.value} control={<Radio size="small" />} label={option.label} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h5">Order Summary</Typography>
              <Typography>Items: {cartItems.length}</Typography>
              <Typography>Total: {formatPrice(cartTotal)}</Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                disabled={status.loading || !isFormValid}
                sx={{ mt: 2 }}
              >
                {status.loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CheckoutPage;
