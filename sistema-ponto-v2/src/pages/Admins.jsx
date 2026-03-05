import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Trash2, Power } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { getUsuarios, criarUsuario, desativarUsuario } from '../services/api';

const Admins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ nome: '', matricula: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      // Assumindo perfil 0 para Admin (ou se a API retornar role 'ADMIN').
      const adminList = data.filter(u => u.perfil === 0 || u.role === 'ADMIN');
      setAdmins(adminList);
    } catch (error) {
      console.error(error);
      showNotification('Erro ao carregar lista de administradores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.matricula || !formData.password) {
      showNotification("Preencha todos os campos obrigatórios!", "error");
      return;
    }

    try {
      await criarUsuario({
        nomeCompleto: formData.nome,
        matricula: formData.matricula,
        senha: formData.password,
        perfil: 0 // Admin
      });

      setIsModalOpen(false);
      setFormData({ nome: '', matricula: '', password: '' });
      showNotification("Admin cadastrado com sucesso!", "success");
      fetchAdmins();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Erro ao cadastrar administrador", "error");
    }
  };

  const handleDeactivate = async (id, matricula) => {
    if (matricula === 'admin') {
      showNotification("Não é possível desativar o admin principal do sistema.", "error");
      return;
    }
    if (!window.confirm('Tem certeza que deseja desativar este administrador?')) return;

    try {
      await desativarUsuario(id);
      showNotification("Admin desativado com sucesso!", "success");
      fetchAdmins();
    } catch (error) {
      console.error(error);
      showNotification("Erro ao desativar admin", "error");
    }
  };

  const filteredAdmins = admins.filter(admin =>
    (admin.nomeCompleto || admin.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.matricula || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ color: '#f2f2f7' }}>
      {toast.show && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
      )}

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Administradores</h1>
          <p style={{ color: '#8e8e93' }}>Gerencie quem tem acesso total ao sistema.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
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

      {/* Barra de Busca (Opcional, mas util) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#8e8e93' }} />
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <th style={{ padding: '18px' }}>Nível</th>
              <th style={{ padding: '18px' }}>Status</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '18px', textAlign: 'center', color: '#8e8e93' }}>Carregando...</td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '18px', textAlign: 'center', color: '#8e8e93' }}>Nenhum administrador encontrado.</td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} style={{ borderBottom: '1px solid #3a3a3c', fontSize: '0.95rem' }}>
                  <td style={{ padding: '18px', fontWeight: '600' }}>{admin.nomeCompleto || admin.nome}</td>
                  <td style={{ padding: '18px', color: '#8e8e93' }}>{admin.matricula}</td>
                  <td style={{ padding: '18px' }}>
                    <Badge type="admin" text="Admin" />
                  </td>
                  <td style={{ padding: '18px' }}><Badge type={admin.status || 'ATIVO'} text={admin.status || 'ATIVO'} /></td>
                  <td style={{ padding: '18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                      {(admin.status === 'ATIVO' || !admin.status) && admin.matricula !== 'admin' && (
                        <button
                          onClick={() => handleDeactivate(admin.id, admin.matricula)}
                          style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer' }}
                          title="Desativar Admin"
                        >
                          <Power size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Administrador">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Nome Completo</label>
            <input
              type="text" required autoFocus
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
              placeholder="Ex: Maria Admin"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Matrícula</label>
              <input
                type="text" required
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
                placeholder="Ex: admin_02"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Senha Inicial</label>
              <input
                type="password" required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
                placeholder="Ex: senhaSegura456"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-hover"
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #3a3a3c', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-hover"
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

export default Admins;