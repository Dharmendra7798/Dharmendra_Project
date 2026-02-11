import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectProducts } from '../features/products/productSelectors';
import ProductCard from '../components/ProductCard/ProductCard';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { getCategories } from '../data/products'; // Utility to get unique categories

// ------------------------------------------------------------------
// Sub-Component: Featured Category Card
// ------------------------------------------------------------------
const CategoryCard = ({ title, icon: Icon, image, link }) => (
  <Card sx={{ textAlign: 'center', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
    <CardMedia
      component="img"
      height="140"
      image={image}
      alt={title}
      sx={{ objectFit: 'cover' }}
    />
    <CardContent>
      <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <Button
        component={Link}
        to={link}
        size="small"
        endIcon={<ArrowForwardIcon />}
        sx={{ mt: 1 }}
      >
        Shop Now
      </Button>
    </CardContent>
  </Card>
);

// ------------------------------------------------------------------
// Main Component: HomePage
// ------------------------------------------------------------------

const HomePage = () => {
  const products = useSelector((state) => state.products.items);

  // Filter and sort for display sections
  const topRated = [...products]
    .filter(p => p.rating > 4.5) // Only show genuinely high-rated items
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
    
  // Prepare dynamic category data
  const categoryData = [
      { name: 'Fitness', icon: FitnessCenterIcon, image: 'https://placehold.co/400x140/80d8ff/ffffff?text=GYM+GEAR', link: '/shop?category=Fitness' },
      { name: 'Basketball', icon: SportsBasketballIcon, image: 'https://placehold.co/400x140/ff8a65/ffffff?text=BASKETBALL', link: '/shop?category=Basketball' },
      { name: 'Football', icon: SportsSoccerIcon, image: 'https://placehold.co/400x140/66bb6a/ffffff?text=FOOTBALL', link: '/shop?category=Football' },
      // Fallback if we have fewer categories, otherwise you can dynamically load all of them
  ].filter(c => getCategories().includes(c.name)); // Ensure the category exists in your data

  return (
    <Box>
      {/* 1. 🚀 Professional Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://placehold.co/1200x550/1976d2/ffffff?text=ELITE+SPORTS+GEAR)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 550,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 8,
          boxShadow: 3,
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1, textShadow: '2px 2px 5px rgba(0,0,0,0.7)' }}>
          PERFORMANCE STARTS HERE
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, maxWidth: 600, textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
          Explore the highest-rated sports accessories trusted by professionals worldwide.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/shop"
          endIcon={<ArrowForwardIcon />}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          View All Products
        </Button>
      </Box>

      {/* 2. 🎯 Featured Categories Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 500 }}>
          Browse By Sport
        </Typography>
        <Grid container spacing={4}>
          {categoryData.map((category) => (
            <Grid item key={category.name} xs={12} sm={6} md={4}>
              <CategoryCard {...category} />
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* 3. ⭐ Top Rated Products Section */}
      <Box sx={{ backgroundColor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 5, fontWeight: 500 }}>
            ⭐ Customer Favorites
          </Typography>
          <Grid container spacing={4}>
            {topRated.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. 🛒 Final CTA Section */}
       <Box sx={{ py: 6, textAlign: 'center', bgcolor: 'primary.light' }}>
        <Typography variant="h4" color="white" gutterBottom>
          Ready to Elevate Your Game?
        </Typography>
        <Typography variant="h6" color="white" sx={{ mb: 3 }}>
          Don't wait—get the gear you need now and feel the difference.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/shop"
          sx={{ py: 1.5, px: 5 }}
        >
          Shop All Collections
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;