import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USER, REGISTER_USER } from '../graphql/operations';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'gaadigo_auth_user';
const STORAGE_KEY_TOKEN = 'gaadigo_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
    } catch {
      return null;
    }
  });

  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  useEffect(() => {
    try {
      if (user && token) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEY_TOKEN, token);
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      }
    } catch (err) {
      console.error('Failed to sync auth to localStorage', err);
    }
  }, [user, token]);

  const login = async (email, password) => {
    const res = await loginMutation({
      variables: {
        input: { email, password },
      },
    });

    const payload = res.data?.loginUser;
    if (payload?.token && payload?.user) {
      setUser(payload.user);
      setToken(payload.token);
      return payload.user;
    }
    throw new Error('Invalid login response');
  };

  const register = async ({ name, email, password, phone, role, city }) => {
    const res = await registerMutation({
      variables: {
        input: { name, email, password, phone, role, city },
      },
    });

    const payload = res.data?.registerUser;
    if (payload?.token && payload?.user) {
      setUser(payload.user);
      setToken(payload.token);
      return payload.user;
    }
    throw new Error('Invalid registration response');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
