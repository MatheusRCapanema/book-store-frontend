// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);