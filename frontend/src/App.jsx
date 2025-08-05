import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Splash from './components/Splash';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { motion } from 'framer-motion';
import vid from './assets/vid.mp4';

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const go = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 1000);
  };

  return (
    <>
      <Navbar />

      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        <div className="absolute inset-0 -z-10 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent)] bg-[url('https://www.transparenttextures.com/patterns/square-gears.png')] opacity-10" />
        <div className="absolute -z-10 left-1/2 top-1/2 h-[120vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 animate-pulse bg-gradient-to-r from-transparent via-[#29c17440] to-transparent blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 h-screen flex flex-col items-center justify-center pt-16 px-4"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-6">
            <video
              src={vid}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-md mb-8 rounded-lg shadow-lg"
            />
          </div>

          <h1 className="mt-10 text-5xl md:text-6xl font-extrabold text-white text-center">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29c174] to-[#0ea5e9]">
              Stock pie
            </span>
          </h1>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => go('/login')}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl text-white font-semibold hover:bg-blue-600 hover:shadow-lg transition text-lg"
            >
              Login
            </button>
            <button
              onClick={() => go('/register')}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl text-white font-semibold hover:bg-green-600 hover:shadow-lg transition text-lg"
            >
              Register
            </button>
          </div>
        </motion.div>

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="h-12 w-12 border-4 border-white/50 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </>
  );
}

function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>

      {!ready && <Splash onFinish={() => setReady(true)} />}
      {ready && (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* ✅ New Register Route */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
