// src/pages/RegisterPage.js
import React, { useState } from 'react';
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
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    cpf: '',
    full_name: '',
    date_of_birth: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
  };

  // Função para validar o formulário antes de enviar
  const validateForm = () => {
    const { email, password, confirm_password, cpf, full_name, date_of_birth } = formData;
    if (!email || !password || !confirm_password || !cpf || !full_name || !date_of_birth) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }
    if (password !== confirm_password) {
      setError('As senhas não coincidem.');
      return false;
    }
    // Adicione mais validações conforme necessário (por exemplo, validação de CPF)
    return true;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remover confirm_password antes de enviar para o backend
      const { confirm_password, ...submitData } = formData;
      await axios.post('/register', submitData);
      setSuccess('Registro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Erro no registro:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
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
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 900, width: '100%', borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            {/* Imagem do lado esquerdo */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <Box
                component="img"
                src="/img/signup-image.jpg"
                alt="Registro"
                sx={{
                  width: '80%',
                  height: 'auto',
                  objectFit: 'fit',
                  padding: 2,
                }}
              />
            </Grid>
            {/* Formulário de registro */}
            <Grid item xs={12} md={6} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Registrar
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
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
                      label="Senha"
                      name="password"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      label="Confirmar Senha"
                      name="confirm_password"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      label="CPF"
                      name="cpf"
                      fullWidth
                      margin="normal"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      helperText="Digite seu CPF sem pontos ou traços."
                    />
                    <TextField
                      label="Nome Completo"
                      name="full_name"
                      fullWidth
                      margin="normal"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      label="Data de Nascimento"
                      name="date_of_birth"
                      type="date"
                      fullWidth
                      margin="normal"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                    <Box mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                      </Button>
                    </Box>
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

export default RegisterPage;