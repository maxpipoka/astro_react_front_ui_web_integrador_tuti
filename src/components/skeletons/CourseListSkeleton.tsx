import React from 'react';

const CourseListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="bg-gray-200 animate-pulse rounded-lg h-40"
        >
          <div className="h-full w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300" />
        </div>
      ))}
    </div>
  );
};

export default CourseListSkeleton;