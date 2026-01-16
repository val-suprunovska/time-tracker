import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсепторы для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);