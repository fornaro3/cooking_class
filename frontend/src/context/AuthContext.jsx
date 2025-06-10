// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      // Ignorar falha ao ler localStorage
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
      const qs = new URLSearchParams({
        'filters[email][$eq]': email,
        'filters[password][$eq]': password,
      }).toString();

      const res = await fetch(`${base}/api/cooking-users?${qs}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return false;

      const body = await res.json();
      const data = body.data;
      if (!Array.isArray(data) || data.length !== 1) return false;

      const entry = data[0];
      const userData = {
        documentId: entry.documentId,
        name: entry.name,
        email: entry.email,
        role: entry.role,
      };

      const fakeJwt = 'dummy-token';
      setUser(userData);
      setToken(fakeJwt);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', fakeJwt);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/');
  };

  const updateUserData = async (payload) => {
    if (!user?.documentId) return false;
    setLoading(true);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
      const res = await fetch(
        `${base}/api/cooking-users/${user.documentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload }),
        }
      );
      if (!res.ok) return false;

      const body = await res.json();
      const updated = body.data;
      const newUser = {
        documentId: updated.documentId,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUserData, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
