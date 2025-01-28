// src/components/UserData.tsx
import React, { useState, useEffect } from 'react';
import { getUserDataById } from '../services/api'; // Asegúrate de que la importación sea correcta
import { useAuth } from '../hooks/useAuth';

// Definimos el tipo para los datos del usuario
interface UserData {
  id: number;
  username: string;
  password: string;
  fullname: string;
  rol: string;
  created_at: string;
  updated_at: string | null;
  active: boolean;
  access_level: number;
}

const UserData: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    username: '',
    password: '',
    fullname: '',
    rol: '',
    created_at: '',
    updated_at: null,
    active: true,
    access_level: 0,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  if (typeof window === 'undefined') {
    return <p className='text-white dark:text-white'>Cargando...</p>;
  }

  // Obtenemos el token y el userId del hook useAuth
  const { token, userId } = useAuth();

  // Obtenemos los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUser Data = async () => {
      try {
        if (!token || !userId) {
          throw new Error('No se encontró el token o el ID del usuario');
        }

        const data = await getUser DataById(token, userId);
        setUser Data(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser Data();
  }, [token, userId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Aquí harías la llamada a tu API para actualizar los datos del usuario
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname: userData.fullname,
          password: newPassword || userData.password, // Envía la nueva contraseña o la actual si no se cambió
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar los datos');
      alert('Datos actualizados correctamente');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Mis Datos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>Fullname:</label>
          <input
            type="text"
            name="fullname"
            value={userData.fullname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Nueva contraseña:</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default UserData;