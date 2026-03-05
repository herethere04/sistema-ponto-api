import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Funcionarios from './pages/Funcionarios';
import Admins from './pages/Admins';
import Ponto from './pages/Ponto';
import Historico from './pages/Historico';

// --- Layout Mestre (Com Menu Lateral) ---
const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1c1c1e' }}>
    <Sidebar />
    <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
      {children}
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Login) */}
        <Route path="/" element={<Login />} />

        {/* Rotas do Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN">
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/funcionarios" element={
          <ProtectedRoute requiredRole="ADMIN">
            <MainLayout><Funcionarios /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/admins" element={
          <ProtectedRoute requiredRole="ADMIN">
            <MainLayout><Admins /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Rotas do Funcionário */}
        <Route path="/funcionario/ponto" element={
          <ProtectedRoute requiredRole="FUNCIONARIO">
            <MainLayout><Ponto /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/funcionario/historico" element={
          <ProtectedRoute requiredRole="FUNCIONARIO">
            <MainLayout><Historico /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Redireciona qualquer rota desconhecida para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;