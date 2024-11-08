// src/pages/CartPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/cart');
      setCartItems(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    setUpdateError('');
    setUpdateSuccess('');
    try {
      await axios.put(`/cart/${itemId}`, { quantity });
      setUpdateSuccess('Cart updated successfully.');
      fetchCart();
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating cart:', err);
      setUpdateError('Failed to update cart.');
    }
  };

  const handleDelete = async (itemId) => {
    setUpdateError('');
    setUpdateSuccess('');
    try {
      await axios.delete(`/cart/${itemId}`);
      setUpdateSuccess('Item removed from cart.');
      fetchCart();
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting cart item:', err);
      setUpdateError('Failed to remove item.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container  className='mt-6'>
      <Typography variant="h4" gutterBottom>
        Seu Carrinho
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      {updateError && <Alert severity="error" style={{ marginBottom: '20px' }}>{updateError}</Alert>}
      {updateSuccess && <Alert severity="success" style={{ marginBottom: '20px' }}>{updateSuccess}</Alert>}
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.book.title}</TableCell>
                  <TableCell>R${item.book.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      inputProps={{ min: 1, style: { width: '60px' } }}
                    />
                  </TableCell>
                  <TableCell>R${(item.book.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6">Total:</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">R${calculateTotal()}</Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            style={{ marginTop: '20px' }}
          >
            Prosseguir com o pagamento
          </Button>
        </>
      )}
    </Container>
  );
};

export default CartPage;