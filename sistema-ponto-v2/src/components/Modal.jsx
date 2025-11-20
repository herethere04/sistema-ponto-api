import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Overlay (Fundo escuro transparente)
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Escurece o fundo
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)' // Efeito de desfoque chique no fundo
    }}>
      {/* Card do Modal */}
      <div style={{
        backgroundColor: '#2c2c2e',
        width: '100%',
        maxWidth: '500px', // Tamanho máximo
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid #3a3a3c',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Cabeçalho do Modal */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #3a3a3c'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f2f2f7', margin: 0 }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo (O Formulário vai aqui) */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;