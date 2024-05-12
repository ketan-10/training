// request.js
import axios from 'axios';
import { getLocalStorage } from '../hooks/useLocalStorage';
import { isTokenValid } from '.';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_IP,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use((config) => {
  const user = getLocalStorage('user', false);
  if (user && user.token && isTokenValid(user.token)) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default request;
