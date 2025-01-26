import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllStudents } from '../services/api';

interface Student {
  id: number;
  dni: number;
  names: string;
  surnames: string;
}

const ITEMS_PER_PAGE = 20;

const StudentSearch = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [displayedStudents, setDisplayedStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver>();
  const lastStudentElementRef = useCallback((node: HTMLElement | null) => {
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

  // Fetch initial data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) {
        setError('No se pudo obtener la información de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await getAllStudents(token);
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al obtener la lista de alumnos');
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  // Handle search filtering
  useEffect(() => {
    const filtered = students.filter(student => 
      student.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surnames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dni.toString().includes(searchTerm)
    );
    setFilteredStudents(filtered);
    setPage(1); // Reset pagination when search term changes
    setHasMore(true);
  }, [searchTerm, students]);

  // Handle pagination
  useEffect(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    const paginatedStudents = filteredStudents.slice(start, end);
    setDisplayedStudents(paginatedStudents);
    setHasMore(end < filteredStudents.length);
  }, [page, filteredStudents]);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
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
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, apellido o DNI..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md overflow-hidden">
        <div className="grid gap-4 p-4">
          {displayedStudents.length === 0 ? (
            <p className="text-center text-custom-text dark:text-gray-400 py-4">
              No se encontraron alumnos
            </p>
          ) : (
            <>
              {displayedStudents.map((student, index) => {
                if (displayedStudents.length === index + 1) {
                  return (
                    <a
                      ref={lastStudentElementRef}
                      key={student.id}
                      href={`/student-report/${student.id}`}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="text-sm">
                          <span className="block text-gray-500 dark:text-gray-400">DNI</span>
                          <span className="font-medium text-custom-text dark:text-gray-50">{student.dni}</span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-gray-500 dark:text-gray-400">Apellidos</span>
                          <span className="font-medium text-custom-text dark:text-gray-50">{student.surnames}</span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-gray-500 dark:text-gray-400">Nombres</span>
                          <span className="font-medium text-custom-text dark:text-gray-50">{student.names}</span>
                        </div>
                      </div>
                    </a>
                  );
                } else {
                  return (
                    <a
                      key={student.id}
                      href={`/student-report/${student.id}`}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="text-sm">
                          <span className="block text-gray-500 dark:text-gray-400">DNI</span>
                          <span className="font-medium text-custom-text dark:text-gray-50">{student.dni}</span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-gray-500 dark:text-gray-400">Apellidos</span>
                          <span className="font-medium text-custom-text dark:text-gray-50">{student.surnames}</span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-gray-500 dark:text-gray-400">Nombres</span>
                          <span className="font-medium text-custom-text dark:text-gray-50">{student.names}</span>
                        </div>
                      </div>
                    </a>
                  );
                }
              })}
              {loading && (
                <div className="text-center py-4">
                  <p className="text-custom-text dark:text-gray-400">Cargando más alumnos...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;