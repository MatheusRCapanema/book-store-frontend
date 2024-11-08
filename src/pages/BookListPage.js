// src/pages/BookListPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Snackbar,
  Pagination,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import axios from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import { useDebounce } from 'use-debounce';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

// Componente Alert personalizado para Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEMS_PER_PAGE = 12; // Itens por página

const BookListPage = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500); // Debounce de 500ms
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [selectedBook, setSelectedBook] = useState(null); // Estado para o livro selecionado
  const [openModal, setOpenModal] = useState(false); // Estado para controlar o modal

  const navigate = useNavigate(); // Inicializando navigate

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [debouncedSearch]);

  // Função para buscar livros com base na busca
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/books', {
        params: {
          search: debouncedSearch,
        },
      });
      console.log('Resposta da API /books:', response.data); // Verifique a estrutura da resposta

      if (Array.isArray(response.data)) {
        // Caso a API retorne um array de livros
        setBooks(response.data);
      } else {
        // Caso a estrutura da resposta seja diferente
        setBooks([]);
        setError('Formato de resposta inesperado da API.');
      }
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Falha ao buscar livros.');
      }
    } finally {
      setLoading(false);
      setPage(1); // Resetar para a primeira página após nova busca
    }
  };

  // Função para adicionar livro ao carrinho e opcionalmente redirecionar
  const handleAddToCart = async (bookId, redirect = false) => {
    if (!user) {
      setSnackbarMessage('Você precisa estar logado para adicionar itens ao carrinho.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post('/cart/add', { book_id: bookId, quantity: 1 });
      setSnackbarMessage('Livro adicionado ao carrinho!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      if (redirect) {
        navigate('/cart'); // Navega para a página do carrinho
      }
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setSnackbarMessage(err.response.data.detail);
      } else {
        setSnackbarMessage('Falha ao adicionar livro ao carrinho.');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Função para fechar o Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Paginação Cliente
  const indexOfLastBook = page * ITEMS_PER_PAGE;
  const indexOfFirstBook = indexOfLastBook - ITEMS_PER_PAGE;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPagesCalc = Math.ceil(books.length / ITEMS_PER_PAGE);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Lista de Livros
      </Typography>

      {/* Campo de Busca */}
      <Box sx={{ marginBottom: '20px' }}>
        <TextField
          label="Buscar Livros"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Indicador de Carregamento */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Mensagem de Erro */}
      {!loading && error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {/* Grade de Livros */}
      <Grid container spacing={3}>
        {Array.isArray(currentBooks) && currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent
                  sx={{ flexGrow: 1, cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedBook(book);
                    setOpenModal(true);
                  }}
                >
                  <Typography variant="h5" component="div" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Autor: {book.author}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {book.description.length > 100
                      ? `${book.description.substring(0, 100)}...`
                      : book.description}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 'auto' }}>
                    Preço: R$ {book.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* Botão Adicionar ao Carrinho */}
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(book.id)}
                    sx={{
                      boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                  {/* Botão Adicionar e Ir para o Carrinho */}
                  <Button
                    size="small"
                    color="secondary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(book.id, true)}
                    sx={{
                      boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Adicionar e Ir para o Carrinho
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          !loading && (
            <Typography variant="body1" sx={{ margin: '20px auto' }}>
              Nenhum livro encontrado.
            </Typography>
          )
        )}
      </Grid>

      {/* Paginação */}
      {totalPagesCalc > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <Pagination
            count={totalPagesCalc}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Modal com Detalhes do Livro */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBook && (
          <>
            <DialogTitle>{selectedBook.title}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Autor: {selectedBook.author}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedBook.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Preço: R$ {selectedBook.price.toFixed(2)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => handleAddToCart(selectedBook.id)}
                sx={{
                  boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
                }}
              >
                Adicionar ao Carrinho
              </Button>
              <Button
                color="secondary"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => handleAddToCart(selectedBook.id, true)}
                sx={{
                  boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
                }}
              >
                Adicionar e Ir para o Carrinho
              </Button>
              <Button
                onClick={() => setOpenModal(false)}
                color="default"
                sx={{
                  boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
                }}
              >
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar para Notificações */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookListPage;