# Sistema de Ponto - Frontend Moderno (v2.0) ⚛️

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Javascript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

> **Status:** 🚧 Em Desenvolvimento (Alpha)

Esta branch (`v2-react`) contém a **nova interface do usuário** do sistema, reescrita do zero utilizando **React + Vite** para oferecer uma experiência mais fluida, moderna e escalável. O objetivo é substituir o frontend legado (v1.0) por esta versão SPA (Single Page Application).

---

## 🚀 Novidades e Melhorias (vs v1.0)

* **Design Profissional (Dark Mode):** Interface inspirada em sistemas corporativos líderes de mercado (ex: Control iD), com foco em ergonomia visual.
* **Navegação SPA:** Troca de telas instantânea sem recarregamento da página, utilizando `React Router`.
* **Componentização:** Uso de componentes reutilizáveis (Sidebar, Badges, Modais, Toasts) para facilitar a manutenção.
* **Funcionalidades Exclusivas:**
    * 🕓 **Relógio em Tempo Real:** Display grande e preciso para o funcionário.
    * 🔔 **Toasts:** Notificações não intrusivas (substituindo os `alert` nativos).
    * 🛡️ **Login Inteligente:** Redirecionamento automático baseado no perfil (Admin vai para Dashboard, Funcionário vai para Ponto).

## 🛠️ Tecnologias Utilizadas

* **Core:** React 18, Vite
* **Roteamento:** React Router Dom
* **Ícones:** Lucide React
* **Estilização:** CSS Moderno (Variables, Flexbox, Grid)
* **Integração:** Fetch API (com arquitetura de Services)

---

## 💻 Como Rodar este Frontend

Como esta versão é focada no Frontend moderno, você precisará do **Node.js** instalado.

### 1. Instalação das Dependências
O código fonte do React reside na pasta `sistema-ponto-v2`.

```bash
# Entre na pasta do projeto
cd sistema-ponto-v2

# Instale os pacotes
npm install
