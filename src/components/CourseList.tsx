import React, { useEffect, useState } from 'react';
import { getCourses, mockData } from '../services/api';
import CourseCard from './CourseCard';

interface Course {
  id: number;
  level: number;
  division: string;
  year: number;
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In production, use this:
        // const response = await getCourses();
        // setCourses(response.data);
        
        // For development, using mock data:
        setCourses(mockData.courses);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los cursos');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-custom-text">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-custom-text">No hay cursos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          level={course.level}
          division={course.division}
          year={course.year}
          onClick={() => {
            // This will be implemented in the next step when we add the attendance form
            window.location.href = `/register-attendance/${course.id}`;
          }}
        />
      ))}
    </div>
  );
};

export default CourseList;