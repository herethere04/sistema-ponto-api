import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  // Fecha automaticamente após 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {/* Ícone baseado no tipo */}
      {type === 'success' ? (
        <CheckCircle size={20} color="#32d74b" />
      ) : (
        <AlertCircle size={20} color="#ff453a" />
      )}
      
      <span style={{ flex: 1 }}>{message}</span>
      
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer' }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;