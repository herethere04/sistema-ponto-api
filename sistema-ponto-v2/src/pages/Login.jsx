import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { KeyRound, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Faz o login na API que agora retorna nosso Cookie HttpOnly seguro transparentemente
      const data = await loginUser(matricula, senha);

      // 2. O Backend agora nos fornece a 'role' diretamente na raiz da resposta
      const role = data.role;
      localStorage.setItem('user_role', role);

      // 3. Redirecionamento Inteligente
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'FUNCIONARIO') {
        navigate('/funcionario/ponto'); // Vai para o relógio
      } else {
        // Se não tiver perfil definido ou for desconhecido
        setError('Perfil de usuário não identificado.');
        localStorage.removeItem('user_role'); // Limpa para não ficar logado errado
      }

    } catch (err) {
      console.error(err);
      setError('Matrícula ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1c1c1e'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#2c2c2e',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid #3a3a3c'
      }}>
        {/* Logo / Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '50px', height: '50px', background: '#0A84FF', borderRadius: '12px', margin: '0 auto 15px' }}></div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f2f2f7', marginBottom: '5px' }}>Bem-vindo</h1>
          <p style={{ color: '#8e8e93' }}>Faça login para continuar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Input Matrícula */}
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8e8e93' }} />
            <input
              type="text"
              placeholder="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px',
                border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none'
              }}
            />
          </div>

          {/* Input Senha */}
          <div style={{ position: 'relative' }}>
            <KeyRound size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8e8e93' }} />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px',
                border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', color: 'white', outline: 'none'
              }}
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div style={{ color: '#ff453a', fontSize: '0.9rem', textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255, 69, 58, 0.1)', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {/* Botão de Entrar */}
          <button
            type="submit"
            disabled={loading}
            className="btn-hover"
            style={{
              padding: '14px', borderRadius: '8px', border: 'none',
              backgroundColor: '#0A84FF', color: 'white', fontWeight: 'bold', fontSize: '1rem',
              cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;