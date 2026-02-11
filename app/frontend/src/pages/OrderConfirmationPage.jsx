import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentOrder } from '../features/order/orderSelectors';
import { clearOrder } from '../features/order/orderSlice';
import { formatPrice } from '../utils/helpers';

import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);

  // Redirect if no order is found in state (prevents direct access/refresh issue)
  useEffect(() => {
    if (!order) {
      // Clear the order state just in case and redirect
      dispatch(clearOrder());
      navigate('/');
    }
  }, [order, navigate, dispatch]);

  if (!order) {
    return null; // Will redirect in useEffect
  }

  const orderId = order._id; // Use the actual DB ID
  const customerName = order.customer.name;
  const orderTotal = order.total;

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" color="success.main" gutterBottom>
          Thank You, {customerName}!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your order has been successfully placed.
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Order ID: {orderId.substring(0, 10).toUpperCase()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Details:
          </Typography>
          <List dense>
            {order.items.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemText
                  primary={`${item.name} x${item.quantity}`}
                  secondary={formatPrice(item.price * item.quantity)}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="text.primary">
            Order Total:
          </Typography>
          <Typography variant="h4" color="primary">
            {formatPrice(orderTotal)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            dispatch(clearOrder()); // Clear the confirmation state
            navigate('/shop');
          }}
        >
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderConfirmationPage;