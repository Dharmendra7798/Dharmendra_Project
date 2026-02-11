import React from 'react';
import { Box, Typography, Container, Grid, Link } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import IconButton from '@mui/material/IconButton';
const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sport Accessories
            </Typography>
            <Typography variant="body2">
              Your one-stop shop for professional-grade sports equipment and fitness gear.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>
              Shop
            </Typography>
            <Link href="/shop" color="inherit" display="block" underline="hover" variant="body2">
              All Products
            </Link>
            <Link href="/about" color="inherit" display="block" underline="hover" variant="body2">
              About Us
            </Link>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Link href="/contact" color="inherit" display="block" underline="hover" variant="body2">
              Contact
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover" variant="body2">
              FAQ
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, borderTop: '1px solid #455a64', pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Sport Accessories. All rights reserved. | Built with MERN Stack.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;