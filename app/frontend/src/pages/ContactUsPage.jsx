import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is a placeholder for form submission logic
    console.log('Form Submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        📞 Get in Touch
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Contact Info */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            Contact Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">+1 (555) 123-4567</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">support@sportaccessories.com</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
            <Typography variant="body1">
              123 Fitness Avenue,
              <br />
              Sports City, TX 75001
            </Typography>
          </Box>
        </Box>

        {/* Contact Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 2 }}>
          <Typography variant="h5" gutterBottom>
            Send us a Message
          </Typography>
          <TextField
            fullWidth
            required
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            required
            label="Your Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            required
            label="Your Message"
            name="message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            sx={{ mt: 2, py: 1.5 }}
          >
            Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactUsPage;