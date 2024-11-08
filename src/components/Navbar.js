// src/components/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from '../axiosConfig';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Função para buscar a contagem do carrinho
  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/cart');
      setCartCount(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar a contagem do carrinho:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-md bg-white transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-md'
      } relative`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado Esquerdo - Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-8 w-8" src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Lado Direito - Links de Menu e Ícones */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                
                {/* Ícone do Carrinho */}
                <div className="relative">
                  <Link
                    to="/cart"
                    className="rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Ver carrinho de compras</span>
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                {/* Ícone do Usuário */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="p-1 rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Ver perfil</span>
                    <User className="h-6 w-6" />
                  </button>
                  {profileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Perfil
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Pedidos
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setProfileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrar
                </Link>
                {/* Ícone do Carrinho */}
                <div className="relative">
                  <Link
                    to="/cart"
                    className="rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Ver carrinho de compras</span>
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                {/* Ícone do Usuário */}
                <Link
                  to="/login"
                  className="rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Entrar</span>
                  <User className="h-6 w-6" />
                </Link>
              </>
            )}
          </div>

          {/* Botão do Menu Mobile */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Carrinho
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Pedidos
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="relative">
                <Link
                  to="/cart"
                  className="rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Ver carrinho de compras</span>
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              {user ? (
                <Link
                  to="/profile"
                  className="ml-auto p-1 rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Ver perfil</span>
                  <User className="h-6 w-6" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ml-auto p-1 rounded-full text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Entrar</span>
                  <User className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
