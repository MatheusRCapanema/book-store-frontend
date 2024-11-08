// src/pages/PasswordResetConfirmPage.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from '../axiosConfig';
import { useLocation } from 'react-router-dom';


const PasswordResetConfirmPage = () => {
  const location = useLocation();
  const { resetToken } = location.state || {};
  const [token, setToken] = useState(resetToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/password-reset-confirm', {
        token,
        new_password: newPassword,
      });
      setSuccess('Password has been reset successfully.');
    } catch (err) {
      console.error('Password reset confirm error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to reset password.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reset Your Password
        </Typography>
        {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
        {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Reset Token"
            name="token"
            fullWidth
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            helperText="Check your email for the reset token."
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default PasswordResetConfirmPage;