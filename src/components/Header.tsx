import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

interface AuthData {
  token: string | null;
  username: string | null;
  userId: number | null;
  accessLevel: number | null;
}

const Header = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const auth = typeof window !== 'undefined' ? useAuth() : null;

  useEffect(() => {
    if (auth) {
      setAuthData({
        token: auth.token,
        username: auth.username,
        userId: auth.userId,
        accessLevel: auth.accessLevel
      });
    }
  }, [auth]);

  const handleLogout = () => {
    if (auth) {
      auth.logout();
      // Remove auth cookie
      document.cookie = 'sie-auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // Redirect to login page
      window.location.replace('/auth');
    }
  };

  const currentDate = format(new Date(), 'MMMM d, yyyy');

  if (!authData) {
    return null;
  }

  const { username, accessLevel } = authData;

  return (
    <header className="bg-custom-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/logo_sie.png" alt="School Logo" className="h-16 w-16 mr-3" />
          <h1 className="text-2xl font-bold text-custom-text">Registro de Asistencia</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-custom-text">{currentDate}</span>
          <div className="flex items-center gap-2">
          <span className="text-sm text-custom-secondary">Usuario: <span className="text-custom-text font-medium">{username}</span></span>
            <span className="text-sm text-custom-secondary">{accessLevel}</span>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;