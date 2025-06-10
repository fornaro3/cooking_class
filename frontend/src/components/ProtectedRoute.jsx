import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, token, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Carregando...</div>; // Ou um spinner de loading
    }

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}