import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const MessageDialog = ({ open, handleClose, message, severity = 'info' }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageDialog;