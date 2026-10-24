import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(tokenStore.get()));

  useEffect(() => {
    const handleUnauthorized = () => setIsAuthenticated(false);
    window.addEventListener('cafe:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('cafe:unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = useCallback(async (username, password) => {
    const data = await api.login(username, password);
    tokenStore.set(data.token);
    setIsAuthenticated(true);
  }, []);

  const handleQuickAdminLogin = useCallback(async () => {
    const data = await api.demoLogin();
    tokenStore.set(data.token);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    tokenStore.clear();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, handleLogin, handleQuickAdminLogin, handleLogout }),
    [isAuthenticated, handleLogin, handleQuickAdminLogin, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
