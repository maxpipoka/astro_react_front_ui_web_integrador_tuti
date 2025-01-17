import React from 'react';

interface AttendanceToggleProps {
  isPresent: boolean;
  onChange: () => void;
}

const AttendanceToggle = ({ isPresent, onChange }: AttendanceToggleProps) => {
  return (
    <button
      onClick={onChange}
      className={`
        px-4 py-2 rounded-full font-medium transition-all duration-200
        ${isPresent 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-red-500 hover:bg-red-600 text-white'
        }
      `}
    >
      {isPresent ? 'PRESENTE' : 'AUSENTE'}
    </button>
  );
};

export default AttendanceToggle;