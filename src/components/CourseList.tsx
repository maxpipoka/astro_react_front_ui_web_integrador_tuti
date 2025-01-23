import React, { useEffect, useState, Suspense, lazy } from 'react';
import { getCoursesByPreceptor } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import CourseCard from './CourseCard';
import CourseListSkeleton from './skeletons/CourseListSkeleton';

interface Course {
  id: number;
  level: number;
  division: string;
  year: number;
}

interface AuthData {
  token: string | null;
  username: string | null;
  userId: number | null;
  accessLevel: number | null;
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchCourses = async () => {
      if (!authData?.token || !authData?.userId) {
        setError('No se pudo obtener la información de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await getCoursesByPreceptor(authData.userId, authData.token);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al obtener la lista de los cursos');
        setLoading(false);
      }
    };

    if (authData) {
      fetchCourses();
    }
  }, [authData?.token, authData?.userId]); // Only re-run if token or userId changes

  if (!authData) {
    return null;
  }

  if (loading) {
    return (
      <CourseListSkeleton />
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
            window.location.href = `/register-attendance/${course.id}`;
          }}
        />
      ))}
    </div>
  );
};

export default CourseList;