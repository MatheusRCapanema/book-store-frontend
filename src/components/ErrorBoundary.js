// src/components/ErrorBoundary.js
import React from 'react';
import { Alert, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // You can log error information to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container style={{ padding: '20px' }}>
          <Alert severity="error">
            <Typography variant="h5">Something went wrong.</Typography>
            <Typography>{this.state.error.toString()}</Typography>
          </Alert>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;