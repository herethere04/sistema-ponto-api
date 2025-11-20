import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';

const Ponto = () => {
  const [now, setNow] = useState(new Date());
  const [workedTime, setWorkedTime] = useState("00:00:00");
  const [showToast, setShowToast] = useState(false);
  
  // Mock: Simula que o funcionário entrou às 08:00 da manhã
  // (Num sistema real, isso viria da API)
  const entryTimeMock = new Date();
  entryTimeMock.setHours(8, 0, 0, 0); 

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);

      // Cálculo de Horas Trabalhadas
      const diff = currentTime - entryTimeMock;
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setWorkedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegister = () => {
    // Aqui chamaremos a API no futuro
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Formatação da Data (ex: Segunda-feira, 20 de Novembro)
  const dateString = now.toLocaleDateString('pt-BR', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', color: '#f2f2f7' }}>
      
      {/* Toast de Sucesso */}
      {showToast && (
        <div className="toast-container">
          <Toast message="Ponto registrado com sucesso!" type="success" onClose={() => setShowToast(false)} />
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
          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f2f2f7' }}>
            Trabalhando
          </div>
        </div>

      </div>

      {/* BOTÃO DE AÇÃO */}
      <button 
        onClick={handleRegister}
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
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(10, 132, 255, 0.3)'
        }}
      >
        Registrar Ponto
      </button>

    </div>
  );
};

export default Ponto;