// src/utils/auth.js

export const getUserRole = () => {
  const role = localStorage.getItem('user_role');
  if (!role) return null;
  return role;
};