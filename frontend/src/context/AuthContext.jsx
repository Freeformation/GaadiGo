import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  LOGIN_USER,
  REGISTER_USER,
  UPDATE_USER_PROFILE,
  CHANGE_PASSWORD,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD_WITH_OTP,
} from '../graphql/operations';

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
  const [updateProfileMutation] = useMutation(UPDATE_USER_PROFILE);
  const [changePasswordMutation] = useMutation(CHANGE_PASSWORD);
  const [requestResetMutation] = useMutation(REQUEST_PASSWORD_RESET);
  const [resetPasswordMutation] = useMutation(RESET_PASSWORD_WITH_OTP);

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

  const updateProfile = async (fields) => {
    if (!user?.id) throw new Error('You must be signed in to update your profile.');
    const res = await updateProfileMutation({
      variables: {
        userId: user.id,
        input: fields,
      },
    });
    const updated = res.data?.updateUserProfile;
    if (updated) {
      setUser((prev) => ({ ...prev, ...updated }));
      return updated;
    }
    throw new Error('Failed to update profile');
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user?.id) throw new Error('You must be signed in to change your password.');
    const res = await changePasswordMutation({
      variables: {
        userId: user.id,
        input: { oldPassword, newPassword },
      },
    });
    return res.data?.changePassword;
  };

  const requestPasswordReset = async (email) => {
    const res = await requestResetMutation({
      variables: {
        input: { email },
      },
    });
    return res.data?.requestPasswordReset;
  };

  const resetPasswordWithOtp = async ({ email, otp, newPassword }) => {
    const res = await resetPasswordMutation({
      variables: {
        input: { email, otp, newPassword },
      },
    });
    const payload = res.data?.resetPasswordWithOtp;
    if (payload?.token && payload?.user) {
      setUser(payload.user);
      setToken(payload.token);
      return payload.user;
    }
    throw new Error('Failed to reset password');
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
        updateProfile,
        changePassword,
        requestPasswordReset,
        resetPasswordWithOtp,
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
