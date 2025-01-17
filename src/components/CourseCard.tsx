import React from 'react';

interface CourseCardProps {
  level: number;
  division: string;
  year: number;
  onClick: () => void;
}

const CourseCard = ({ level, division, year, onClick }: CourseCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-custom-primary p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="text-xl font-bold text-custom-text mb-2">
        {level}° "{division}"
      </h3>
      <p className="text-custom-text">
        Año lectivo: {year}
      </p>
    </div>
  );
};

export default CourseCard;