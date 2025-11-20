import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Funcionarios from './pages/Funcionarios';
import Admins from './pages/Admins';
import Ponto from './pages/Ponto'; // <--- IMPORT NOVO

// --- Páginas Temporárias (Mocks) ---
const Login = () => (
  <div style={{ height: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#1c1c1e' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: '#0A84FF', borderRadius: '16px', margin: '0 auto 20px' }}></div>
      <h1 style={{ color: '#f2f2f7', marginBottom: '10px' }}>Sistema Ponto</h1>
      <p style={{ color: '#8e8e93', marginBottom: '30px' }}>Versão 2.0 (React + Vite)</p>
      <a 
        href="/admin/dashboard" 
        style={{ 
          display: 'inline-block',
          backgroundColor: '#0A84FF',
          color: 'white',
          padding: '12px 30px',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)'
        }}
      >
        Entrar como Administrador
      </a>
    </div>
  </div>
);

const Dashboard = () => (
  <div style={{ color: '#f2f2f7' }}>
    <h1 style={{ marginBottom: '10px' }}>Painel Geral</h1>
    <p style={{ color: '#8e8e93' }}>Bem-vindo ao sistema de gestão.</p>
  </div>
);

// --- Layout Mestre (Com Menu Lateral) ---
const AdminLayout = ({ children }) => (
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
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/funcionarios" element={<AdminLayout><Funcionarios /></AdminLayout>} />
        <Route path="/admin/admins" element={<AdminLayout><Admins /></AdminLayout>} />

        {/* ROTA NOVA: Tela de Ponto do Funcionário */}
        {/* (Estamos usando o AdminLayout por enquanto para facilitar a navegação pelo menu) */}
        <Route path="/funcionario/ponto" element={<AdminLayout><Ponto /></AdminLayout>} />

        {/* Redireciona qualquer rota desconhecida para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;