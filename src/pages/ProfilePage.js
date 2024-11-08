// src/pages/ProfilePage.js
import React, { useState, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    cpf: user?.cpf || '',
    full_name: user?.full_name || '',
    date_of_birth: user?.date_of_birth || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccess('Perfil atualizado com sucesso.');
      // Atualiza o contexto do usuário
      // Implementar a lógica necessária para atualizar o contexto, se aplicável
      setFormData({
        ...formData,
        password: '',
      });
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Falha ao atualizar o perfil.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3}>
        <Typography variant="h4" gutterBottom>
          Perfil
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
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="CPF"
            name="cpf"
            fullWidth
            margin="normal"
            value={formData.cpf}
            onChange={handleChange}
          />
          <TextField
            label="Nome Completo"
            name="full_name"
            fullWidth
            margin="normal"
            value={formData.full_name}
            onChange={handleChange}
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
          />
          <TextField
            label="Nova Senha"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            helperText="Deixe em branco para manter a senha atual"
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Atualizar Perfil
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ProfilePage;