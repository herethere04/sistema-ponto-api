import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
    const currentRole = getUserRole();

    if (!currentRole) {
        // Não logado, manda pro login
        return <Navigate to="/" replace />;
    }

    if (requiredRole && currentRole !== requiredRole) {
        // Tenta acessar algo sem permissão, joga de volta pro login ou pra um fallback
        if (currentRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (currentRole === 'FUNCIONARIO') return <Navigate to="/funcionario/ponto" replace />;
        return <Navigate to="/" replace />;
    }

    // Autorizado! Retorna a página
    return children;
};

export default ProtectedRoute;
