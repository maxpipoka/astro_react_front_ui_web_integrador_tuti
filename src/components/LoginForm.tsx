import React, { useState, useEffect } from 'react';
import { login } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const authStore = typeof window !== 'undefined' ? useAuth : null;
  const loginUser = authStore?.getState().login;

  // Check if already logged in
  useEffect(() => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.token) {
          window.location.href = '/';
        }
      } catch (e) {
        // Invalid stored data
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(username, password);
      
      if (response.data && response.data.token) {
        if (loginUser) {
          loginUser({ 
            token: response.data.token,
            username: response.data.username,
            userId: response.data.user_id,
            accessLevel: response.data.access_level
          });
          
          // Force reload to trigger middleware
          window.location.href = '/';
        } else {
          setError('Error al inicializar el almacenamiento');
        }
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error de autenticación');
      } else {
        setError('Error al conectar con el servidor');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-custom-text font-medium mb-1">
          Usuario
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-custom-accent focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-custom-text font-medium mb-1">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-custom-accent focus:border-transparent"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        className="w-full bg-custom-accent text-white font-medium py-2 px-4 rounded hover:opacity-90 transition-opacity"
      >
        Ingresar
      </button>
    </form>
  );
};

export default LoginForm;