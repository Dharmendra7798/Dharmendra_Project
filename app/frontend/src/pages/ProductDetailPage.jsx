import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectProductById } from '../features/products/productSelectors';
import { addItem } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/helpers';
import MessageDialog from '../components/MessageDialog/MessageDialog';

import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  Divider,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productSelector = selectProductById(id);
  const product = useSelector(productSelector);

  const [open, setOpen] = React.useState(false);

  if (!product) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h4" color="error">
          Product Not Found
        </Typography>
        <Button component={Link} to="/shop" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to Shop
        </Button>
      </Container>
    );
  }

  const isInStock = product.stock > 0;

  const handleAddToCart = () => {
    dispatch(addItem({ ...product, quantity: 1 }));
    setOpen(true);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Button component={Link} to="/shop" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to Shop
      </Button>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{ width: '100%', height: 'auto', borderRadius: 2, objectFit: 'cover' }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="overline" color="text.secondary">
            {product.category}
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating name="read-only" value={product.rating} readOnly precision={0.1} size="large" />
            <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              ({product.rating} / 5)
            </Typography>
          </Box>
          <Typography variant="h4" color="primary" gutterBottom>
            {formatPrice(product.price)}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Chip
              label={isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              color={isInStock ? 'success' : 'error'}
              size="medium"
              sx={{ mr: 2 }}
            />
            {!isInStock && (
                 <Typography variant="body2" color="error">
                 Please check back soon.
               </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={!isInStock}
            sx={{ py: 1.5 }}
          >
            {isInStock ? 'Add to Cart' : 'Currently Unavailable'}
          </Button>
        </Grid>
      </Grid>
      <MessageDialog
        open={open}
        handleClose={() => setOpen(false)}
        message={`${product.name} added to cart!`}
        severity="success"
      />
    </Container>
  );
};

export default ProductDetailPage;