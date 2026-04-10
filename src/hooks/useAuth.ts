import { useState } from 'react';

const ADMIN_PASSWORD = 'H0ndacrx89';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isAdmin: isAuthenticated,
    login,
    logout,
  };
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}