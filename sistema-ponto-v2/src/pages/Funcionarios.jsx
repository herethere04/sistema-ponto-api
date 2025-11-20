import React, { useState } from 'react';
import { Plus, Search, Edit2, Power } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Toast from '../components/Toast'; // <--- Importamos o Toast

const Funcionarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para controlar o Toast { show: boolean, message: string, type: 'success'|'error' }
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [funcionarios, setFuncionarios] = useState([
    { id: 1, nome: 'Áquila Barbosa', matricula: '1001', carga: 'Desenvolvedor', status: 'ATIVO' },
    { id: 2, nome: 'João Silva', matricula: '1002', carga: 'Analista', status: 'INATIVO' },
  ]);

  const [formData, setFormData] = useState({ nome: '', matricula: '', cargo: '' });

  // Função para mostrar notificação
  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // O componente Toast fecha sozinho via useEffect, mas aqui limpamos o estado visual
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.nome || !formData.matricula) {
      showNotification("Preencha todos os campos obrigatórios!", "error");
      return;
    }

    const novoId = funcionarios.length + 1;
    const novoFunc = {
      id: novoId,
      nome: formData.nome,
      matricula: formData.matricula,
      carga: formData.cargo,
      status: 'ATIVO'
    };

    setFuncionarios([...funcionarios, novoFunc]);
    setIsModalOpen(false);
    setFormData({ nome: '', matricula: '', cargo: '' });
    
    // CHAMANDO O NOVO TOAST (Em vez de alert)
    showNotification("Funcionário cadastrado com sucesso!", "success");
  };

  return (
    <div style={{ color: '#f2f2f7' }}>
      
      {/* --- TOAST CONTAINER (Fica flutuando) --- */}
      {toast.show && (
        <div className="toast-container">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })} 
          />
        </div>
      )}

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Funcionários</h1>
          <p style={{ color: '#8e8e93' }}>Gerencie o acesso e cadastro da equipe.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-hover" // <--- CLASSE NOVA DE ANIMAÇÃO
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0A84FF', color: 'white',
            border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)'
          }}
        >
          <Plus size={20} />
          Novo Funcionário
        </button>
      </div>

      {/* Barra de Busca */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#8e8e93' }} />
          <input 
            type="text" placeholder="Buscar por nome ou matrícula..." 
            style={{
              width: '100%', padding: '14px 14px 14px 48px', borderRadius: '10px', border: '1px solid #3a3a3c',
              backgroundColor: '#2c2c2e', color: 'white', fontSize: '1rem', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: '#2c2c2e', borderRadius: '12px', border: '1px solid #3a3a3c', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #3a3a3c', color: '#8e8e93', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '18px' }}>Nome</th>
              <th style={{ padding: '18px' }}>Matrícula</th>
              <th style={{ padding: '18px' }}>Carga</th>
              <th style={{ padding: '18px' }}>Status</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((func) => (
              <tr key={func.id} style={{ borderBottom: '1px solid #3a3a3c', fontSize: '0.95rem' }}>
                <td style={{ padding: '18px', fontWeight: '600' }}>{func.nome}</td>
                <td style={{ padding: '18px', color: '#8e8e93' }}>{func.matricula}</td>
                <td style={{ padding: '18px' }}>{func.carga}</td>
                <td style={{ padding: '18px' }}><Badge type={func.status} text={func.status} /></td>
                <td style={{ padding: '18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#0A84FF', cursor: 'pointer' }}><Edit2 size={18} /></button>
                    <button style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer' }}><Power size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Funcionário">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Nome Completo</label>
            <input 
              type="text" required autoFocus
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
              placeholder="Ex: João da Silva"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Matrícula</label>
              <input 
                type="text" required
                value={formData.matricula}
                onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
                placeholder="Ex: 1005"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Cargo</label>
              <input 
                type="text" required
                value={formData.cargo}
                onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
                placeholder="Ex: Vendedor"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="btn-hover" // <--- ANIMAÇÃO AQUI
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #3a3a3c', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn-hover" // <--- ANIMAÇÃO AQUI
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#0A84FF', color: 'white', cursor: 'pointer', fontWeight: '600' }}
            >
              Salvar
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default Funcionarios;