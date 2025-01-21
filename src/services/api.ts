import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const login = async (username: string, password: string) => {
  try {
    console.log('entrando al login')
    const response = await api.post('/auth', { username, password });
    console.log(response)
    return response;
  } catch (error) {
    throw error;
  }
};

export const mockData = {
  // ... rest of the mock data
};