// src/pages/PaymentSuccessPage.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';


const PaymentSuccessPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  return (
    <Container style={{ textAlign: 'center', padding: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Pagamento Concluído!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Obrigado por comprar. O número do seu pedido é <strong>{orderId}</strong>.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/orders">
        Ver Pedido
      </Button>
    </Container>
  );
};

export default PaymentSuccessPage;