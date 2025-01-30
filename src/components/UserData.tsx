import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { getUserDataById , updateUserData} from '../services/api';

interface UserData {
  id: number;
  username: string;
  fullname: string;
  rol: string;
  created_at: string;
  updated_at: string | null;
  active: boolean;
  access_level: number;
}

const UserData: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFullname, setEditingFullname] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [tempFullname, setTempFullname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Get auth data from localStorage directly
  const getAuthData = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const authData = localStorage.getItem('sie-auth-storage');
      console.log('Raw auth data from localStorage:', authData);
      
      if (authData) {
        const parsed = JSON.parse(authData);
        console.log('Parsed auth data:', parsed);
        return parsed.state;
      }
      return null;
    } catch (err) {
      console.error('Error parsing auth data:', err);
      return null;
    }
  };

  useEffect(() => {
    console.log('UserData component mounted');
    
    const fetchUserData = async () => {
      console.log('Fetching user data...');
      try {
        const authData = getAuthData();
        console.log('Auth data retrieved:', authData);

        if (!authData?.token || !authData?.userId) {
          console.error('Missing auth data:', { token: !!authData?.token, userId: authData?.userId });
          throw new Error('No se encontró el token o el ID del usuario');
        }

        console.log('Making API call for user:', authData.userId);
        const response = await getUserDataById(authData.token, authData.userId);
        console.log('API Response:', response);

        if (response?.data) {
          console.log('Setting user data:', response.data);
          setUserData(response.data);
          setTempFullname(response.data.fullname);
        } else {
          throw new Error('No se recibieron datos del usuario');
        }
      } catch (err: any) {
        console.error('Error in fetchUserData:', err);
        setError(err.response?.data?.message || err.message || 'Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveFullname = async () => {
    setLoading(true);
    setError(null);
    const authData = getAuthData();
  
    try {
      const response = await updateUserData(authData.token, authData.userId, 'fullname', tempFullname);
      setUserData(prev => prev ? { ...prev, fullname: tempFullname } : null);
      setEditingFullname(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el nombre');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
  
    setLoading(true);
    setError(null);
    const authData = getAuthData();
  
    try {
      await updateUserData(authData.token, authData.userId, 'password', newPassword);
      setEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const cancelFullnameEdit = () => {
    setTempFullname(userData?.fullname || '');
    setEditingFullname(false);
  };

  const cancelPasswordEdit = () => {
    setNewPassword('');
    setConfirmPassword('');
    setEditingPassword(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse p-6 bg-white dark:bg-custom-darkblue rounded-lg shadow-md">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-custom-darkblue rounded-lg shadow-md">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-custom-text dark:text-gray-50">Mis Datos</h2>
        <p className="text-custom-text dark:text-gray-50 mt-2">Gestione su información personal</p>
      </div>

      <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Username - No editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              value={userData?.username || ''}
              disabled
              className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
            />
          </div>

          {/* Fullname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingFullname ? tempFullname : userData?.fullname || ''}
                onChange={(e) => setTempFullname(e.target.value)}
                disabled={!editingFullname}
                className={`flex-1 p-2 border rounded-md ${
                  editingFullname
                    ? 'bg-white dark:bg-gray-800 border-custom-accent'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                } text-gray-700 dark:text-gray-300`}
              />
              {!editingFullname ? (
                <button
                  onClick={() => setEditingFullname(true)}
                  className="p-2 text-custom-accent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveFullname}
                    className="p-2 text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FaSave className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelFullnameEdit}
                    className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            {!editingPassword ? (
              <div className="flex gap-2">
                <input
                  type="password"
                  value="********"
                  disabled
                  className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
                />
                <button
                  onClick={() => setEditingPassword(true)}
                  className="p-2 text-custom-accent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="w-full p-2 border border-custom-accent rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="w-full p-2 border border-custom-accent rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleSavePassword}
                    className="p-2 text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FaSave className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelPasswordEdit}
                    className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rol - No editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol
            </label>
            <input
              type="text"
              value={userData?.rol || ''}
              disabled
              className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;