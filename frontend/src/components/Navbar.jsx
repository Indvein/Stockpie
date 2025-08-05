import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#29c174] to-[#0ea5e9] bg-clip-text text-transparent">
                StockPie
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition">
              Home
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="text-white/80 hover:text-white transition">
                Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#29c174] to-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-[#29c174] to-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-[#0f172a] border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-white/10">
              {isLoggedIn ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;