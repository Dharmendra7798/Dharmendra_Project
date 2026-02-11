import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom align="center">
        🏆 About Sport Accessories
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Mission
        </Typography>
        <Typography paragraph>
          We are dedicated to providing athletes of all levels with the **highest quality sports equipment and accessories**. Our mission is to fuel your passion, enhance your performance, and ensure you have the best gear to reach your fitness goals. From the court to the gym, we've got you covered.
        </Typography>
        <Typography paragraph>
          Founded in 2023, Sport Accessories started with a small team of fitness enthusiasts who were tired of compromising quality for price. We carefully curate our collection to ensure every product meets rigorous standards for durability, functionality, and performance.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Our Values
        </Typography>
        <ul>
          <li>Quality First: We source only premium materials and proven designs.</li>
          <li>Customer Focus: Your satisfaction and success are our top priorities.</li>
          <li>Innovation: Constantly seeking new technologies to improve training and play.</li>
        </ul>
      </Box>
    </Container>
  );
};

export default AboutUsPage;