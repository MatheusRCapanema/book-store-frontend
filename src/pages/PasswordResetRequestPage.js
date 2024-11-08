// src/pages/PasswordResetRequestPage.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const PasswordResetRequestPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/password-reset-request', { email });
      // In production, you would send the reset token via email.
      // For testing, we'll retrieve it from the response.
      const resetToken = response.data.reset_token;
      setSuccess('Password reset instructions sent to email.');
      // Redirect to the confirm page with the reset token
      navigate('/password-reset-confirm', { state: { resetToken } });
    } catch (err) {
      console.error('Password reset request error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to request password reset.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Password Reset Request
        </Typography>
        {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
        {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send Password Reset Email
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default PasswordResetRequestPage;
