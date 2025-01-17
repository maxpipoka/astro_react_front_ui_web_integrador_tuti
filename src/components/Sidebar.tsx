import React from 'react';
import { 
  FaUserCheck, 
  FaClipboardList, 
  FaChartBar, 
  FaUser 
} from 'react-icons/fa';

const menuItems = [
  { 
    label: 'Registrar Asistencia', 
    icon: FaUserCheck, 
    href: '/register-attendance' 
  },
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

const Sidebar = () => {
  return (
    <aside className="w-64 bg-custom-primary shadow-md h-[calc(100vh-80px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-custom-text rounded hover:bg-custom-background transition-colors"
              >
                <item.icon className="text-custom-accent" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;