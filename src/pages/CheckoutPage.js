// src/pages/CheckoutPage.js
import React, { useContext, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Box,
} from '@mui/material';
import axios from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Inicializando navigate

  // Função para iniciar o checkout
  const initiateCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/checkout', { payment_method: 'paypal' });
      setRedirectUrl(response.data.redirect_url);
      window.location.href = response.data.redirect_url; // Redireciona para PayPal
    } catch (err) {
      console.error('Erro no checkout:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Falha ao iniciar o checkout.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar o alerta de erro
  const handleCloseError = () => {
    setError('');
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">Você deve estar logado para prosseguir para o checkout.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Pagamento
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseError}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Informação sobre o pedido */}
          <Button
            variant="contained"
            color="primary"
            onClick={initiateCheckout}
            disabled={loading}
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.5)',
              },
              '&:active': {
                boxShadow: 'inset 0px 0px 1px rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Prosseguir para Pagamento com PayPal'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;