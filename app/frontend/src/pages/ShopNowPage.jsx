import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../data/products';
import { setCategoryFilter, setSortOrder, setSearchQuery } from '../features/products/productSlice';
import {
  selectFilteredAndSortedProducts,
  selectCategoryFilter,
  selectSortOrder,
  selectSearchQuery
} from '../features/products/productSelectors';
import ProductCard from '../components/ProductCard/ProductCard';

import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Components
const CategoryFilter = () => {
  const dispatch = useDispatch();
  const categories = getCategories();
  const activeFilter = useSelector(selectCategoryFilter);

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <List disablePadding>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton
              selected={activeFilter === category}
              onClick={() => dispatch(setCategoryFilter(category))}
              sx={{ py: 0 }}
            >
              <ListItemText primary={category} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const SortDropdown = () => {
  const dispatch = useDispatch();
  const sortOrder = useSelector(selectSortOrder);

  const sortOptions = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
  ];

  return (
    <TextField
      select
      label="Sort By"
      value={sortOrder}
      onChange={(e) => dispatch(setSortOrder(e.target.value))}
      size="small"
      sx={{ minWidth: 200 }}
    >
      {sortOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

const ShopNowPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectFilteredAndSortedProducts);
  const searchQuery = useSelector(selectSearchQuery);

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        All Sports Gear
      </Typography>
      <Grid container spacing={4}>
        {/* Left Column: Filters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              InputProps={{
                startAdornment: (
                  <SearchIcon color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
          </Box>
          <CategoryFilter />
        </Grid>

        {/* Right Column: Products */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Showing {products.length} items
            </Typography>
            <SortDropdown />
          </Box>

          <Grid container spacing={4}>
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} lg={4}>
                  <ProductCard product={product} />
                </Grid>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', width: '100%' }}>
                <Typography variant="h5" color="text.secondary">
                  No products found matching your criteria.
                </Typography>
                <Typography variant="body1">
                  Try adjusting your filters or search query.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopNowPage;