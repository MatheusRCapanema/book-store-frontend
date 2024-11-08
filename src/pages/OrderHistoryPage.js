// src/pages/OrderHistoryPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  TableContainer,
  Box, // Adicionando Box à importação
} from '@mui/material';
import axios from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/orders/history');
      setOrders(response.data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Falha ao carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  };

  // Função para determinar a cor do Chip baseado no status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'pago':
        return 'success';
      case 'pending':
      case 'pendente':
        return 'warning';
      case 'cancelled':
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">Você deve estar logado para ver seus pedidos.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Histórico de Pedidos
      </Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {orders.length === 0 && !loading ? (
        <Typography align="center" sx={{ mt: 4 }}>
          Você não possui pedidos.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ mt: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID do Pedido</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Data do Pedido</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Fatura</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell align="right">R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {new Date(order.created_at).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        component={Link}
                        to={`/invoice/${order.id}`}
                      >
                        Ver Fatura
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default OrderHistoryPage;