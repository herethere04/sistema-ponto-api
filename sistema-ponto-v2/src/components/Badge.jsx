import React from 'react';

const Badge = ({ type, text }) => {
  // Define as cores baseadas no tipo
  const styles = {
    ativo: {
      bg: 'rgba(50, 215, 75, 0.15)',
      color: '#32d74b',
      border: '1px solid rgba(50, 215, 75, 0.3)'
    },
    inativo: {
      bg: 'rgba(255, 69, 58, 0.15)',
      color: '#ff453a',
      border: '1px solid rgba(255, 69, 58, 0.3)'
    },
    admin: {
      bg: 'rgba(10, 132, 255, 0.15)',
      color: '#0A84FF',
      border: '1px solid rgba(10, 132, 255, 0.3)'
    }
  };

  const style = styles[type.toLowerCase()] || styles.ativo;

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.color,
      border: style.border,
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'inline-block'
    }}>
      {text}
    </span>
  );
};

export default Badge;