import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';

// Auth provider will:
// 1. Provide the user object to the rest of the app
// 2. Call login API to get token and store it in local storage
// 3. Call logout API to remove token from local storage
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);

  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};

export default AuthProvider;
