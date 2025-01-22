import axios from 'axios';

const API_URL = 'https://flask-api-rest-integrador-tuti.vercel.app/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth', { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCoursesByPreceptor = async (preceptorId: number, token: string) => {
  try {
    const response = await api.get(`/cursos/preceptor/${preceptorId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const mockData = {
  // ... rest of the mock data
};