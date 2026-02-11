import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const QuantitySelector = ({ quantity, onQuantityChange, stock }) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < stock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > stock) {
      value = stock;
    }
    onQuantityChange(value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: 120 }}>
      <IconButton onClick={handleDecrement} disabled={quantity <= 1} size="small">
        <RemoveIcon />
      </IconButton>
      <TextField
        value={quantity}
        onChange={handleInputChange}
        inputProps={{ min: 1, max: stock, style: { textAlign: 'center' } }}
        size="small"
        sx={{ width: 40 }}
      />
      <IconButton onClick={handleIncrement} disabled={quantity >= stock} size="small">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;