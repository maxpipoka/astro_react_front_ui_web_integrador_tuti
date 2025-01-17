import React from 'react';
import { format } from 'date-fns';
import { mockData } from '../services/api';

const Header = () => {
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const { user } = mockData;

  return (
    <header className="bg-custom-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="School Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-2xl font-bold text-custom-text">Attendance System</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-custom-text">{currentDate}</span>
          <div className="flex items-center gap-2">
            <span className="text-custom-text font-medium">{user.fullname}</span>
            <span className="text-sm text-custom-secondary">({user.rol})</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;