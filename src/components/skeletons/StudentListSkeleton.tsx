import React from 'react';
import ContentLoader from 'react-content-loader';

const StudentListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <ContentLoader 
            speed={2}
            width={800}
            height={60}
            viewBox="0 0 800 60"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="3" ry="3" width="100" height="15" />
            <rect x="0" y="25" rx="3" ry="3" width="150" height="20" />
            <rect x="270" y="0" rx="3" ry="3" width="100" height="15" />
            <rect x="270" y="25" rx="3" ry="3" width="150" height="20" />
            <rect x="540" y="0" rx="3" ry="3" width="100" height="15" />
            <rect x="540" y="25" rx="3" ry="3" width="150" height="20" />
          </ContentLoader>
        </div>
      ))}
    </div>
  );
};

export default StudentListSkeleton;