import React, { useEffect, useState } from 'react';
import { 
  FaUserCheck, 
  FaClipboardList, 
  FaChartBar, 
  FaUser 
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

  return (
    <aside className="w-64 bg-custom-primary dark:bg-gray-900 shadow-md h-[calc(100vh-80px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href} className='dark:hover:text-gray-900'>
              <a
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-custom-text rounded hover:bg-custom-lightblue dark:hover:text-custom-text transition-colors"
              >
                <item.icon className="text-custom-accent" />
                <span className='dark:text-gray-200'>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;