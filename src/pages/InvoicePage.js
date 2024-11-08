// src/pages/InvoicePage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Badge,
  Box,
  Paper,
} from '@mui/material';
import axios from '../axiosConfig';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { format } from 'date-fns';

const InvoicePage = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para buscar a fatura
  const fetchInvoice = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/orders/${orderId}/invoice`);
      setInvoice(response.data);
    } catch (err) {
      console.error('Erro ao buscar a fatura:', err);
      setError('Falha ao carregar a fatura.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orderId) {
      fetchInvoice();
    }
    // eslint-disable-next-line
  }, [user, orderId]);

  // Função para formatar a data
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  // Função para determinar a cor do Badge baseado no status
  const getBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="warning" style={{ marginTop: '20px' }}>
          Você precisa estar logado para visualizar faturas.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container>
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Nenhum dado de fatura disponível.
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '30px', marginBottom: '30px' }}>
      {/* Cabeçalho da Fatura */}
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Fatura #{invoice.order_id}</Typography>
          <Badge
            badgeContent={invoice.status}
            color={getBadgeColor(invoice.status)}
            sx={{ fontSize: '1rem', padding: '10px' }}
          />
        </Box>
        <Typography variant="subtitle1" color="textSecondary">
          Criado em: {formatDateTime(invoice.created_at)}
        </Typography>
      </Paper>

      {/* Informações do Cliente */}
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <Typography variant="h5" gutterBottom>
          Informações do Cliente
        </Typography>
        <Typography>
          <strong>Nome de Usuário:</strong> {invoice.user.username}
        </Typography>
        <Typography>
          <strong>Email:</strong> {invoice.user.email}
        </Typography>
      </Paper>

      {/* Resumo do Pedido */}
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <Typography variant="h5" gutterBottom>
          Resumo do Pedido
        </Typography>
        <Typography>
          <strong>Total:</strong> R$ {invoice.total.toFixed(2)}
        </Typography>
        <Typography>
          <strong>Status:</strong> {invoice.status}
        </Typography>
      </Paper>

      {/* Itens do Pedido */}
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Itens do Pedido
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Título do Livro</strong></TableCell>
              <TableCell align="right"><strong>Quantidade</strong></TableCell>
              <TableCell align="right"><strong>Preço</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.book_title}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">R$ {item.price.toFixed(2)}</TableCell>
                <TableCell align="right">R$ {(item.quantity * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {/* Linha de Total */}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="h6"><strong>Total</strong></Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6"><strong>R$ {invoice.total.toFixed(2)}</strong></Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default InvoicePage;