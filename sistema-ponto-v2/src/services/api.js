// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const loginUser = async (matricula, senha) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula, senha }),
      credentials: 'include', // Necessário para salvar o Cookie retornado pelo .NET
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Falha na autenticação');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error("Erro no logout:", error);
  }
};

export const getUsuarios = async () => {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Falha ao buscar usuários');
  return response.json();
};

export const criarUsuario = async (dadosUsuario) => {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(dadosUsuario),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao criar usuário');
  }
  return response; // Can be 201 Created
};

export const desativarUsuario = async (id) => {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id}/desativar`, {
    method: 'PATCH',
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Falha ao desativar usuário');
  return response;
};

export const updatePonto = async (usuarioId, dadosHorario) => {
  // Mock fallback já que a API ainda não possui a rota de correção de ponto
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Horário ajustado com sucesso. (Mock)' });
    }, 500);
  });
};

export const getPontoHoje = async (usuarioId) => {
  // O backend C# usa o ID do usuário que vem no token para buscar, mas testaremos o endpoint.
  // Assumindo que a rota seja /api/ponto/hoje para o usuário atual (baseado no token).
  // Se o backend for /api/ponto, e retorna todos, adaptamos dps. Vamos tentar /api/ponto/hoje primeiro. 
  // Na versão HTML estava apenas /api/ponto (POST). Não tinha GET na tela de ponto, ele apenas simulava o relógio correndo.

  // Como o PontoController.cs tem [Route("api/[controller]")], vamos dar GET em api/ponto
  const response = await fetch(`${API_BASE_URL}/ponto`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Falha ao buscar pontos');
  return response.json();
};

export const getHistoricoPonto = async () => {
  const response = await fetch(`${API_BASE_URL}/ponto/historico`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Falha ao buscar histórico de pontos');
  return response.json();
};

export const registrarPonto = async () => {
  const response = await fetch(`${API_BASE_URL}/ponto/registrar`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao registrar ponto');
  }
  return response.json();
};