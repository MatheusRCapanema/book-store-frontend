// src/pages/PaymentCancelledPage.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';


const PaymentCancelledPage = () => {
  return (
    <Container style={{ textAlign: 'center', padding: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your payment was cancelled. You can continue shopping or try again.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Continue Shopping
      </Button>
    </Container>
  );
};

export default PaymentCancelledPage;