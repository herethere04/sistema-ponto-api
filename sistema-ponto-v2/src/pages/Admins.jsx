import React, { useState } from 'react';
import { Plus, Search, Shield, Trash2 } from 'lucide-react';
import Badge from '../components/Badge';

const Admins = () => {
  // Mock Data (Admins)
  const [admins] = useState([
    { id: 1, nome: 'Áquila Barbosa', matricula: '1001', email: 'aquila@empresa.com', status: 'ADMIN' },
    { id: 2, nome: 'Super Usuário', matricula: 'admin', email: 'admin@sistema.com', status: 'ADMIN' },
  ]);

  return (
    <div style={{ color: '#f2f2f7' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Administradores</h1>
          <p style={{ color: '#8e8e93' }}>Gerencie quem tem acesso total ao sistema.</p>
        </div>
        
        {/* BOTÃO ATUALIZADO (Igual ao de Funcionários) */}
        <button 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: '#0A84FF', // Azul vibrante
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)', // Sombra azul brilhante
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={20} />
          Novo Admin
        </button>
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: '#2c2c2e', borderRadius: '12px', border: '1px solid #3a3a3c', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #3a3a3c', color: '#8e8e93', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '18px' }}>Nome</th>
              <th style={{ padding: '18px' }}>Matrícula</th>
              <th style={{ padding: '18px' }}>Email</th>
              <th style={{ padding: '18px' }}>Nível</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} style={{ borderBottom: '1px solid #3a3a3c', fontSize: '0.95rem' }}>
                <td style={{ padding: '18px', fontWeight: '600' }}>{admin.nome}</td>
                <td style={{ padding: '18px', color: '#8e8e93' }}>{admin.matricula}</td>
                <td style={{ padding: '18px' }}>{admin.email}</td>
                <td style={{ padding: '18px' }}>
                  <Badge type="admin" text="Admin" />
                </td>
                <td style={{ padding: '18px', textAlign: 'right' }}>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer', opacity: admin.matricula === 'admin' ? 0.3 : 1 }} 
                    disabled={admin.matricula === 'admin'}
                    title="Remover Admin"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;