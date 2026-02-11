import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItem, updateQuantity } from '../features/cart/cartSlice';
import {
  selectCartItems,
  selectCartSubtotal,
  selectShippingCost,
  selectCartTotal,
} from '../features/cart/cartSelectors';
import { formatPrice } from '../utils/helpers';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector';

import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Component for individual cart item
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  // Note: We need the stock from the main product list. Since the cart item only stores ID/Price/Quantity,
  // we'll assume a large stock (e.g., 99) for this component simplicity, or ideally, fetch it from productSlice.
  // For now, we assume large stock for QuantitySelector:
  const itemStock = 99; 

  return (
    <Card sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: 'cover' }}
        image={item.imageUrl}
        alt={item.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', py: 1, '&:last-child': { pb: 1 } }}>
          <Typography component="div" variant="h6">
            {item.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formatPrice(item.price)}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            stock={itemStock}
          />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Subtotal: {formatPrice(item.price * item.quantity)}
          </Typography>
        </Box>
      </Box>
      <IconButton aria-label="remove" onClick={handleRemove} sx={{ mr: 2 }}>
        <DeleteIcon color="error" />
      </IconButton>
    </Card>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const shipping = useSelector(selectShippingCost);
  const total = useSelector(selectCartTotal);

  const isCartEmpty = cartItems.length === 0;

  if (isCartEmpty) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button variant="contained" color="primary" size="large" component={Link} to="/shop">
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Your Shopping Cart ({cartItems.length} items)
      </Typography>
      <Grid container spacing={4}>
        {/* Left Column: Cart Items */}
        <Grid item xs={12} md={8}>
          <Box>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </Box>
        </Grid>

        {/* Right Column: Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="body1">Shipping:</Typography>
              <Typography variant="body1" color={shipping === 0 ? 'success.main' : 'text.primary'}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Total:</Typography>
              <Typography variant="h4" color="primary">
                {formatPrice(total)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 3 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;