import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem } from '../../features/cart/cartSlice';
import { formatPrice } from '../../utils/helpers';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Box,
  Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MessageDialog from '../MessageDialog/MessageDialog';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleAddToCart = () => {
    dispatch(addItem(product));
    setOpen(true);
  };

  const isInStock = product.stock > 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component={Link}
        to={`/products/${product.id}`}
        image={product.imageUrl}
        title={product.name}
        sx={{ paddingTop: '56.25%', cursor: 'pointer' }} // 16:9 Aspect Ratio
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating name="read-only" value={product.rating} readOnly precision={0.1} size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.rating})
          </Typography>
        </Box>
        <Chip
          label={isInStock ? `Stock: ${product.stock}` : 'Out of Stock'}
          color={isInStock ? 'success' : 'error'}
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="h5" color="primary">
          {formatPrice(product.price)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={!isInStock}
        >
          {isInStock ? 'Add to Cart' : 'Sold Out'}
        </Button>
        <Button size="small" component={Link} to={`/products/${product.id}`}>
          Details
        </Button>
      </CardActions>
      <MessageDialog
        open={open}
        handleClose={() => setOpen(false)}
        message={`${product.name} added to cart!`}
        severity="success"
      />
    </Card>
  );
};

export default ProductCard;