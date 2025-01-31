import React, { useEffect, useState } from 'react';
import {
  FaBars, 
  FaUserCheck, 
  FaClipboardList, 
  FaChartBar, 
  FaUser,
  FaTimes,
  FaCog
} from 'react-icons/fa';
import { PiStudentBold } from "react-icons/pi";
import { FaPersonBreastfeeding } from "react-icons/fa6";

import { useAuth } from '../hooks/useAuth';

interface AuthData {
  token: string | null;
  username: string | null;
  userId: number | null;
  accessLevel: number | null;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string; // Opcional para elementos con submenús
  subItems?: MenuItem[]; // Subelementos del menú
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

  const menuItems: MenuItem[] = [
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
    },
    ...(authData.accessLevel === 1 ? [{
      label: 'Administracion',
      icon: FaCog,
      subItems:[
        { label: 'Alumnos', icon: PiStudentBold, href: '/admin/students' },
        { label: 'Tutores', icon: FaPersonBreastfeeding , href: '/admin/tutors' },
        { label: 'Cursos', icon: FaChartBar, href: '/admin/courses' },
        { label: 'Asistencias', icon: FaClipboardList, href: '/admin/attendances' },
        { label: 'Roles', icon: FaUser, href: '/admin/roles' },
        { label: 'Usuarios', icon: FaUserCheck, href: '/admin/users' },
      ]
    }]: []),
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
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={sidebarClasses}>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                {/* Elemento principal del menú */}
                <a
                  href={item.href || '#'}
                  className="flex items-center 
                  gap-3 px-4 py-3 text-custom-text 
                  dark:text-white rounded hover:bg-custom-accent 
                  dark:hover:bg-custom-accent dark:hover:text-custom-text 
                  transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="text-custom-accent" />
                  <span>{item.label}</span>
                </a>

                {/* Subelementos del menú */}
                {item.subItems && (
                  <ul className="pl-6 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.label}>
                        <a
                          href={subItem.href}
                          className="flex items-center gap-3 px-4 py-2 text-custom-text dark:text-white rounded hover:bg-custom-accent dark:hover:bg-custom-accent dark:hover:text-custom-text transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <subItem.icon className="text-custom-accent" />
                          <span>{subItem.label}</span>
                        </a>

              </li>
            ))}
          </ul>
          )}
          </li>
          ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;