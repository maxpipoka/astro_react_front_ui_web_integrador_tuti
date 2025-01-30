import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { FaBars } from 'react-icons/fa';
import { es } from 'date-fns/locale';

interface AuthData {
  token: string | null;
  username: string | null;
  userId: number | null;
  accessLevel: number | null;
}

const Header = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = typeof window !== 'undefined' ? useAuth() : null;

  const getAccessLevelText = (level) => {
    switch (level) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Secretario';
      case 3:
        return 'Preceptor';
      default:
        return 'Usuario';
    }
  };

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
      document.cookie = 'sie-auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.replace('/auth');
    }
  };

  const currentDate = format(new Date(), 'd MMMM, yyyy', {locale: es});

  if (!authData) {
    return null;
  }

  const { username, accessLevel } = authData;

  return (
    <header className="bg-custom-primary dark:bg-gray-800 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/images/logo_sie.png" alt="School Logo" className="h-12 w-12 md:h-16 md:w-16 mr-3" />
            <h1 className="text-xl md:text-2xl font-bold text-custom-text dark:text-white">Registro de Asistencia</h1>
          </div>
          
          <button 
            className="md:hidden text-custom-text dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="h-6 w-6" />
          </button>

          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-4 w-full md:w-auto`}>
            <span className="text-custom-text dark:text-gray-200 text-sm md:text-base">{currentDate}</span>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className="text-sm text-custom-secondary dark:text-gray-400">
                Usuario: <span className="text-custom-text dark:text-white font-medium">{username}</span>
              </span>
              <span className="text-sm text-custom-secondary dark:text-gray-400">
                Rol: <span className="text-custom-text dark:text-white font-medium">{getAccessLevelText(accessLevel)}</span>
              </span>
              <button
                onClick={handleLogout}
                className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm md:text-base"
              >
                Cerrar Sesión
              </button>
            <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;