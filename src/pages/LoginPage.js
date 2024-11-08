import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from '../axiosConfig';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('/login', {
        email: formData.email,
        password: formData.password,
      });
      login(response.data.access_token);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;

        if (Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((errorItem) => errorItem.msg);
          setError(errorMessages.join(' '));
        } else if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else if (errorData.detail && typeof errorData.detail.msg === 'string') {
          setError(errorData.detail.msg);
        } else {
          setError('Ocorreu um erro inesperado.');
        }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ maxWidth: 900, width: '100%', mx: 2, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            {/* Imagem do lado esquerdo */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src="/img/signin-image.jpg"
                alt="Login"
                sx={{
                  width: '400px',
                  height: '400px',
                  objectFit: 'contain',
                }}
              />
            </Grid>
            {/* Formulário de login */}
            <Grid item xs={12} md={6} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Login
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      margin="normal"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                      }
                      label="Remember me"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Log in'}
                    </Button>
                  </form>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
