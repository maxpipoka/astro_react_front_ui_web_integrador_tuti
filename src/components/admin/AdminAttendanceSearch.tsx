import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAllCourses } from '../../services/api';
import '../../styles/global.css';

interface Course {
  id: number;
  level: number;
  division: string;
  year: number;
  current: boolean;
  active: boolean;
}

const ITEMS_PER_PAGE = 20;

const AdminAttendanceSearch = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastCourseElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const token = useAuth?.getState()?.token;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError('No se pudo obtener la información de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await getAllCourses(token);
        setCourses(response.data);
        setFilteredCourses(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al obtener la lista de cursos');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.level.toString().includes(searchTerm.toLowerCase()) ||
      course.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.year.toString().includes(searchTerm)
    );
    setFilteredCourses(filtered);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, courses]);

  useEffect(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    const paginatedCourses = filteredCourses.slice(start, end);
    setDisplayedCourses(paginatedCourses);
    setHasMore(end < filteredCourses.length);
  }, [page, filteredCourses]);

  const handleEditClick = (courseId: number) => {
    const confirmEdit = window.confirm('¿Estás seguro de que deseas editar la información de este curso?');
    if (confirmEdit) {
      window.location.href = `/admin/attendances-course-edit/${courseId}`;
    }
  };


  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por Nivel, Division o Año..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
            disabled
          />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por Nivel, División o Año..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md overflow-hidden">
        <div className="grid gap-4 p-4">
          {displayedCourses.length === 0 ? (
            <p className="text-center text-custom-text dark:text-gray-400 py-4">
              No se encontraron cursos
            </p>
          ) : (
            
            displayedCourses.map((course, index) => {
            
              return (
                <div
                  key={course.id}
                  ref={displayedCourses.length === index + 1 ? lastCourseElementRef : null}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-sm">
                      <span className="block text-gray-500 dark:text-gray-400">Nivel</span>
                      <span className="font-medium text-custom-text dark:text-gray-50">{course.level}</span>
                    </div>
                    <div className="text-sm">
                      <span className="block text-gray-500 dark:text-gray-400">División</span>
                      <span className="font-medium text-custom-text dark:text-gray-50">{course.division}</span>
                    </div>
                    <div className="text-sm">
                      <span className="block text-gray-500 dark:text-gray-400">Año</span>
                      <span className="font-medium text-custom-text dark:text-gray-50">{course.year}</span>
                    </div>
                    <div className="text-sm">
                      <span className="block text-gray-500 dark:text-gray-400">Actual</span>
                      <span className="font-medium text-custom-text dark:text-gray-50">
                        {course.current ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="block text-gray-500 dark:text-gray-400">Activo</span>
                      <span className={`font-medium ${course.active ? "text-green-600" : "text-red-600"}`}>
                        {course.active ? "Sí" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-start md:justify-center">
                      <button
                        onClick={() => handleEditClick(course.id)}
                        className="bg-custom-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Editar Asistencia
                      </button>
                    </div>
                  </div>
                </div>
              );
            }))}
          {loading && (
            <div className="text-center py-4">
              <p className="text-custom-text dark:text-gray-400">Cargando más cursos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceSearch;