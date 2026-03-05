import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Power, Clock } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { getUsuarios, criarUsuario, desativarUsuario, updatePonto } from '../services/api';

const Funcionarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
  const [selectedFuncId, setSelectedFuncId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Added senha to formData since API requires it for new users
  const [formData, setFormData] = useState({ nome: '', matricula: '', password: '' });
  const [ajusteFormData, setAjusteFormData] = useState({ data: '', entrada: '', saida: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      // Assumindo perfil 1 para Funcionário (ou se a API retornar role). Ajuste se necessário.
      // Se a API não estiver retornando perfil, vamos apenas mostrar todos por enquanto ou basear em alguma lógica
      // Vamos tentar filtrar perfil == 1 ou Role == 'FUNCIONARIO'
      const funcList = data.filter(u => u.perfil === 1 || u.role === 'FUNCIONARIO' || u.perfil === undefined);
      setFuncionarios(funcList);
    } catch (error) {
      console.error(error);
      showNotification('Erro ao carregar lista de funcionários', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
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
        perfil: 1 // Funcionario
      });

      setIsModalOpen(false);
      setFormData({ nome: '', matricula: '', password: '' });
      showNotification("Funcionário cadastrado com sucesso!", "success");
      fetchFuncionarios(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Erro ao cadastrar funcionário", "error");
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Tem certeza que deseja desativar este funcionário?')) return;

    try {
      await desativarUsuario(id);
      showNotification("Funcionário desativado com sucesso!", "success");
      fetchFuncionarios(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      showNotification("Erro ao desativar funcionário", "error");
    }
  };

  const handleAjuste = async (e) => {
    e.preventDefault();
    if (!ajusteFormData.data || !ajusteFormData.entrada) {
      showNotification("Preencha ao menos a Data e a Hora de Entrada.", "error");
      return;
    }

    try {
      await updatePonto(selectedFuncId, ajusteFormData);
      setIsAjusteModalOpen(false);
      setAjusteFormData({ data: '', entrada: '', saida: '' });
      showNotification("Ponto ajustado com sucesso!", "success");
    } catch (err) {
      showNotification("Erro ao ajustar ponto.", "error");
    }
  };

  const openAjusteModal = (id) => {
    setSelectedFuncId(id);
    setIsAjusteModalOpen(true);
  };

  const filteredFuncionarios = funcionarios.filter(func =>
    (func.nomeCompleto || func.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (func.matricula || '').toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Funcionários</h1>
          <p style={{ color: '#8e8e93' }}>Gerencie o acesso e cadastro da equipe.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-hover"
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
              <th style={{ padding: '18px' }}>Status</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: '18px', textAlign: 'center', color: '#8e8e93' }}>Carregando...</td>
              </tr>
            ) : filteredFuncionarios.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '18px', textAlign: 'center', color: '#8e8e93' }}>Nenhum funcionário encontrado.</td>
              </tr>
            ) : (
              filteredFuncionarios.map((func) => (
                <tr key={func.id} style={{ borderBottom: '1px solid #3a3a3c', fontSize: '0.95rem' }}>
                  <td style={{ padding: '18px', fontWeight: '600' }}>{func.nomeCompleto || func.nome}</td>
                  <td style={{ padding: '18px', color: '#8e8e93' }}>{func.matricula}</td>
                  <td style={{ padding: '18px' }}><Badge type={func.status} text={func.status} /></td>
                  <td style={{ padding: '18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                      {func.status === 'ATIVO' && (
                        <>
                          <button
                            onClick={() => openAjusteModal(func.id)}
                            style={{ background: 'none', border: 'none', color: '#0A84FF', cursor: 'pointer' }}
                            title="Ajuste de Ponto"
                          >
                            <Clock size={18} />
                          </button>
                          <button
                            onClick={() => handleDeactivate(func.id)}
                            style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer' }}
                            title="Desativar Funcionário"
                          >
                            <Power size={18} />
                          </button>
                        </>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Funcionário">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Nome Completo</label>
            <input
              type="text" required autoFocus
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
                placeholder="Ex: 1005"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Senha Inicial</label>
              <input
                type="password" required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none' }}
                placeholder="Ex: senha123"
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

      {/* Modal de Ajuste de Ponto */}
      <Modal isOpen={isAjusteModalOpen} onClose={() => setIsAjusteModalOpen(false)} title="Ajuste de Ponto">
        <form onSubmit={handleAjuste} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Data do Ajuste</label>
            <input
              type="date" required autoFocus
              value={ajusteFormData.data}
              onChange={(e) => setAjusteFormData({ ...ajusteFormData, data: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none', colorScheme: 'dark' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Hora de Entrada</label>
              <input
                type="time" required
                value={ajusteFormData.entrada}
                onChange={(e) => setAjusteFormData({ ...ajusteFormData, entrada: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none', colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#8e8e93', fontSize: '0.9rem' }}>Hora de Saída</label>
              <input
                type="time"
                value={ajusteFormData.saida}
                onChange={(e) => setAjusteFormData({ ...ajusteFormData, saida: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none', colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAjusteModalOpen(false)}
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
              Confirmar Ajuste
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default Funcionarios;