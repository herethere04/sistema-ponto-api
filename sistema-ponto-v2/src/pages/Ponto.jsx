import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';
import { registrarPonto, getHistoricoPonto } from '../services/api';

const Ponto = () => {
  const [now, setNow] = useState(new Date());
  const [workedTime, setWorkedTime] = useState("00:00:00");
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [registrosHoje, setRegistrosHoje] = useState([]);
  const [statusAtual, setStatusAtual] = useState("Não Iniciado");

  const fetchData = async () => {
    try {
      const data = await getHistoricoPonto();
      const hojeLocal = new Date().toLocaleDateString('en-CA');

      const hojePontos = data.filter(p => new Date(p.timestamp).toLocaleDateString('en-CA') === hojeLocal)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setRegistrosHoje(hojePontos.map(p => ({
        time: new Date(p.timestamp).toLocaleTimeString('pt-BR'),
        type: p.tipoRegistro,
        dateObj: new Date(p.timestamp)
      })));

      if (hojePontos.length > 0) {
        const lastPonto = hojePontos[hojePontos.length - 1];
        setStatusAtual(lastPonto.tipoRegistro === 'ENTRADA' ? "Trabalhando" : "Encerrado/Pausa");
      } else {
        setStatusAtual("Não Iniciado");
      }
    } catch (err) {
      console.error("Erro ao buscar registros de hoje", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Atualiza o relógio a cada segundo e recalcula o tempo
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);

      let msTrabalhados = 0;
      let entradaAtual = null;

      registrosHoje.forEach(reg => {
        if (reg.type === 'ENTRADA') {
          entradaAtual = reg.dateObj;
        } else if (reg.type === 'SAIDA' && entradaAtual) {
          msTrabalhados += (reg.dateObj - entradaAtual);
          entradaAtual = null;
        }
      });

      if (entradaAtual) {
        msTrabalhados += (currentTime - entradaAtual);
      }

      if (msTrabalhados > 0) {
        const hours = Math.floor(msTrabalhados / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((msTrabalhados % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((msTrabalhados % 60000) / 1000).toString().padStart(2, '0');
        setWorkedTime(`${hours}:${minutes}:${seconds}`);
      } else {
        setWorkedTime("00:00:00");
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [registrosHoje]);

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registrarPonto();
      showNotification("Ponto registrado com sucesso na API!", "success");
      await fetchData(); // Update visually with server timestamps immediately
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Erro ao registrar ponto", "error");
    } finally {
      setLoading(false);
    }
  };

  // Formatação da Data (ex: Segunda-feira, 20 de Novembro)
  const dateString = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', color: '#f2f2f7' }}>

      {/* Toast */}
      {toast.show && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
      )}

      {/* Cabeçalho */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Meu Ponto</h1>
        <p style={{ color: '#8e8e93' }}>Registre sua jornada diária.</p>
      </div>

      {/* RELÓGIO PRINCIPAL (CARD) */}
      <div style={{
        backgroundColor: '#2c2c2e',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        border: '1px solid #3a3a3c',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '4.5rem',
          fontWeight: '700',
          fontFamily: 'monospace',
          color: '#0A84FF',
          lineHeight: 1,
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(10, 132, 255, 0.3)' // Efeito Neon
        }}>
          {now.toLocaleTimeString('pt-BR')}
        </div>
        <div style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#8e8e93', fontSize: '0.9rem' }}>
          {dateString}
        </div>
      </div>

      {/* GRID DE INFORMAÇÕES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>

        {/* Card Horas Trabalhadas */}
        <div style={{ backgroundColor: '#2c2c2e', padding: '20px', borderRadius: '16px', border: '1px solid #3a3a3c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#8e8e93', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>
            <Clock size={16} />
            Trabalhadas Hoje
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '600', fontFamily: 'monospace', color: '#32d74b' }}>
            {workedTime}
          </div>
        </div>

        {/* Card Status (Mock) */}
        <div style={{ backgroundColor: '#2c2c2e', padding: '20px', borderRadius: '16px', border: '1px solid #3a3a3c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#8e8e93', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>
            <CheckCircle size={16} />
            Status Atual
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: statusAtual === 'Trabalhando' ? '#32d74b' : '#f2f2f7' }}>
            {statusAtual}
          </div>
        </div>

      </div>

      {/* BOTÃO DE AÇÃO */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="btn-hover"
        style={{
          width: '100%',
          padding: '20px',
          backgroundColor: '#0A84FF',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.7 : 1,
          boxShadow: '0 8px 20px rgba(10, 132, 255, 0.3)',
          transition: 'all 0.2s'
        }}
      >
        {loading ? 'Registrando...' : 'Registrar Ponto'}
      </button>

      {/* LISTA DE REGISTROS DE HOJE */}
      {registrosHoje.length > 0 && (
        <div style={{ marginTop: '30px', backgroundColor: '#2c2c2e', borderRadius: '16px', padding: '20px', border: '1px solid #3a3a3c' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#f2f2f7' }}>Registros Recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {registrosHoje.map((reg, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#1c1c1e', borderRadius: '10px', border: '1px solid #3a3a3c' }}>
                <span style={{ color: '#8e8e93', fontWeight: '500' }}>{reg.type}</span>
                <span style={{ color: '#f2f2f7', fontWeight: '600', fontFamily: 'monospace' }}>{reg.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Ponto;