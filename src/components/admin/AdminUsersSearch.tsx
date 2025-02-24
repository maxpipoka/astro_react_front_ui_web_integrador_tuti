import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers } from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import '../../styles/global.css';

interface User {
  id: number;
  username: string;
  fullname: string;
  rol: string;
  active: boolean;
  access_level: number;
}

const ITEMS_PER_PAGE = 20;

const AdminUsersSearch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastUserElementRef = useCallback((node: HTMLElement | null) => {
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
    const fetchUsers = async () => {
      if (!token) {
        setError('No se pudo obtener la información de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await getAllUsers(token);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al obtener la lista de usuarios');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.includes(searchTerm)
    );
    setFilteredUsers(filtered);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, users]);

  useEffect(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(start, end);
    setDisplayedUsers(paginatedUsers);
    setHasMore(end < filteredUsers.length);
  }, [page, filteredUsers]);

  const handleEditClick = (userId: number) => {
    const confirmEdit = window.confirm('¿Estás seguro de que deseas editar la información de este usuario?');
    if (confirmEdit) {
      window.location.href = `/admin/user-edit/${userId}`;
    }
  };

  const handleNewStudent = () => {
    window.location.href = '/admin/student-new';
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o rol..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
            disabled
          />
          <button
            disabled
            className="bg-custom-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 opacity-50"
          >
            <FaPlus /> Nuevo Usuario
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
          placeholder="Buscar por nombre o rol..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent bg-white dark:bg-gray-700 text-custom-text dark:text-white"
        />
        <button
          onClick={handleNewStudent}
          className="bg-custom-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md overflow-hidden">
        <div className="grid gap-4 p-4">
          {displayedUsers.length === 0 ? (
            <p className="text-center text-custom-text dark:text-gray-400 py-4">
              No se encontraron alumnos
            </p>
          ) : (
            displayedUsers.map((user, index) => (
              <div
                key={user.id}
                ref={displayedUsers.length === index + 1 ? lastUserElementRef : null}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Nombre de Usuario</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{user.username}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Nombre Completo</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{user.fullname}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Rol</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{user.rol}</span>
                  </div>
                  <div className="flex justify-start md:justify-center">
                    <button
                      onClick={() => handleEditClick(user.id)}
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
              <p className="text-custom-text dark:text-gray-400">Cargando más alumnos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersSearch;