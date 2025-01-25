import React, { useEffect, useState } from 'react';
import { 
  FaUserCheck, 
  FaClipboardList, 
  FaChartBar, 
  FaUser,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

interface AuthData {
  token: string | null;
  username: string | null;
  userId: number | null;
  accessLevel: number | null;
}

const Sidebar = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!authData) {
    return null;
  }

  const menuItems = [
    ...(authData.accessLevel === 3 ? [{
      label: 'Registrar Asistencia', 
      icon: FaUserCheck, 
      href: '/register-attendance' 
    }] : []),
    { 
      label: 'Revisar Asistencia', 
      icon: FaClipboardList, 
      href: '/check-attendance' 
    },
    { 
      label: 'Generar Reportes', 
      icon: FaChartBar, 
      href: '/reports' 
    },
    { 
      label: 'Mis Datos', 
      icon: FaUser, 
      href: '/profile' 
    }
  ];

  const sidebarClasses = `
    fixed md:static 
    top-0 left-0 
    h-full w-64 
    bg-custom-primary dark:bg-custom-darkblue shadow-md
    transform transition-transform duration-300 ease-in-out
    md:transform-none
    z-50
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-50 bg-custom-accent text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaUserCheck />}
      </button>

      <aside className={sidebarClasses}>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-custom-text dark:text-white rounded hover:bg-custom-accent dark:hover:bg-custom-accent dark:hover:text-custom-text transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="text-custom-accent" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;