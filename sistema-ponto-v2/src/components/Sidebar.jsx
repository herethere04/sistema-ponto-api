import React from 'react';
import { LayoutDashboard, Users, UserCog, LogOut, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, text: "Painel", path: "/admin/dashboard" },
    { icon: Users, text: "Funcionários", path: "/admin/funcionarios" },
    { icon: UserCog, text: "Administradores", path: "/admin/admins" },
    // NOVO ITEM ADICIONADO:
    { icon: Clock, text: "Meu Ponto (Teste)", path: "/funcionario/ponto" },
  ];

  return (
    <div style={{
      width: '260px',
      backgroundColor: '#2c2c2e',
      height: '100vh',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #3a3a3c',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: '#0A84FF', borderRadius: '8px' }}></div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>
          Sistema <span style={{fontWeight: '300'}}>Ponto</span>
        </h2>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '8px',
                backgroundColor: isActive ? 'rgba(10, 132, 255, 0.1)' : 'transparent',
                color: isActive ? '#0A84FF' : '#8e8e93',
                borderLeft: isActive ? '3px solid #0A84FF' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.text}</span>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div 
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          color: '#ff453a',
          cursor: 'pointer',
          borderTop: '1px solid #3a3a3c',
          marginTop: 'auto',
          paddingTop: '24px'
        }}
      >
        <LogOut size={20} />
        <span style={{fontSize: '0.95rem'}}>Sair do Sistema</span>
      </div>
    </div>
  );
};

export default Sidebar;