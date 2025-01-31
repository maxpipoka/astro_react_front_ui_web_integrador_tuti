import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAllTutors } from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import '../../styles/global.css';

interface Tutor {
  id: number;
  dni: number;
  names: string;
  surnames: string;
}

const ITEMS_PER_PAGE = 20;

const AdminTutorSearch = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [displayedTutors, setDisplayedTutors] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastTutorElementRef = useCallback((node: HTMLElement | null) => {
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
    const fetchTutors = async () => {
      if (!token) {
        setError('No se pudo obtener la información de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await getAllTutors(token);
        setTutors(response.data);
        setFilteredTutors(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al obtener la lista de tutores');
        setLoading(false);
      }
    };

    fetchTutors();
  }, [token]);

  useEffect(() => {
    const filtered = tutors.filter(tutor =>
      tutor.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.surnames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.dni.toString().includes(searchTerm)
    );
    setFilteredTutors(filtered);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, tutors]);

  useEffect(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    const paginatedTutors = filteredTutors.slice(start, end);
    setDisplayedTutors(paginatedTutors);
    setHasMore(end < filteredTutors.length);
  }, [page, filteredTutors]);

  const handleEditClick = (tutorId: number) => {
    const confirmEdit = window.confirm('¿Estás seguro de que deseas editar la información de este tutor?');
    if (confirmEdit) {
      window.location.href = `/admin/tutor-edit/${tutorId}`;
    }
  };

  const handleNewStudent = () => {
    window.location.href = '/admin/tutor-new';
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
            disabled
          />
          <button
            disabled
            className="bg-custom-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 opacity-50"
          >
            <FaPlus /> Nuevo Tutor
          </button>
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
          placeholder="Buscar por nombre, apellido o DNI..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
        />
        <button
          onClick={handleNewStudent}
          className="bg-custom-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FaPlus /> Nuevo Tutor
        </button>
      </div>

      <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md overflow-hidden">
        <div className="grid gap-4 p-4">
          {displayedTutors.length === 0 ? (
            <p className="text-center text-custom-text dark:text-gray-400 py-4">
              No se encontraron tutores
            </p>
          ) : (
            displayedTutors.map((tutor, index) => (
              <div
                key={tutor.id}
                ref={displayedTutors.length === index + 1 ? lastTutorElementRef : null}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">DNI</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{tutor.dni}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Apellidos</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{tutor.surnames}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Nombres</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{tutor.names}</span>
                  </div>
                  <div className="flex justify-start md:justify-center">
                    <button
                      onClick={() => handleEditClick(tutor.id)}
                      className="bg-custom-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="text-center py-4">
              <p className="text-custom-text dark:text-gray-400">Cargando más tutores...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTutorSearch;