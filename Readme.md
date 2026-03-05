# Sistema de Ponto (API .NET Core + Web React)

## Descrição

Este projeto é uma solução fullstack moderna para registro e gestão de ponto de funcionários. A versão atual (**v2-react**) aposentou o antigo layout estático em prol de um robusto **Frontend SPA em React**, acoplado a uma API RESTful escalável construída em **C# com .NET 8**. O sistema introduz Controle de Acesso Baseado em Níveis (RBAC), separando as interfaces, permissões e experiências entre **Administradores** e **Funcionários**, garantindo produtividade e alta segurança.

---

## Arquitetura e Tecnologias

###  Backend (API RESTful)
* **Linguagem & Framework:** C# com .NET 8.
* **Arquitetura:** Clean Architecture com forte separação de camadas (Domain, Application, Infrastructure, Api).
* **Banco de Dados:** PostgreSQL (orquestrado dinamicamente via Docker).
* **ORM:** Entity Framework Core 8.
* **Autenticação:** JWT (JSON Web Tokens) através de Cookies de segurança.
* **Documentação:** Swagger Completo (OpenAPI).

###  Frontend (Single Page Application)
* **Core:** React 18, alimentado por Vite para compilação super rápida.
* **Roteamento:** React Router DOM com proteção `ProtectedRoute` verificando os cargos/níveis.
* **Componentes Gráficos:** Lucide React para iconografia vetorial.
* **Estética:** Design system customizado em CSS moderno suportando Dark Theme (tons ricos e suaves, inspirados em painéis OLED).

---

## Funcionalidades Principais

### Visão do Administrador
* 📊 **Dashboard Analítico:** Resumo de dados de uso do sistema, ativos na tela inicial.
* 👨‍💼 **Gestão de Funcionários & Administradores:** Listagem, registro, desativação de contas e controle restrito.
* 🕒 **Gerência de Ponto:** Capacidade técnica via frontend (Botão Ajuste de Ponto) pronta para correções manuais de horas de empregados.

### Visão do Funcionário
* ⏱️ **Relógio Dinâmico "Meu Ponto":** Calculadora real-time que processa a diferença de ms de cada batida "ENTRADA" e "SAÍDA" no servidor.
* 📅 **Extrato Diário "Meu Histórico":** Consulta particular dos pontos agrupados por dia, reportando o saldo/banco de horas no mês.

---

## Passos de Segurança Implementados

Visando tornar esse software viável para cenários corporativos contra vetores de ataque comuns web:

1. **HttpOnly Cookies na Sessão (Prevenção XSS):** O sistema não exibe nem carrega mais os JWTs abertamente via LocalStorage, mitigando a chance de roubo de sessão em cenários Cross-Site Scripting.
2. **Rate Limiting Nativo C# (Prevenção Força Bruta):** O Endpoint de Login limita conexões massivas. Um usuário ou bot que tentar realizar múltiplos logins errôneos seguidos será bloqueado por um temporizador `HTTP 429 Too Many Requests`.
3. **ORM Blindado (Prevenção SQL Injection):** Todo tráfego banco/código é filtrado e parametrizado nativamente pelo EF Core.
4. **Hashing Criptográfico Avançado:** BCrypt protegendo armazenamento de senhas de todos os usuários de forma unidirecional.

---

## Como Baixar e Rodar (Localmente)

**Pré-requisitos:**
* [Node.js (v18+)](https://nodejs.org/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### 1. Clonando o Repositório
Baixe o sistema especificamente na branch do Frontend em React:
```bash
git clone -b v2-react https://github.com/herethere04/sistema-ponto-api
cd sistema-ponto-api
```

### 2. Inicializando o Servidor & Banco de Dados (Backend)
Na pasta raiz (`sistema-ponto-api`), rode o Docker Compose. Ele baixará as imagens do Postgres e compilará isoladamente toda sua infraestrutura .NET.
```bash
docker-compose up --build -d
```
*(Nas próximas execuções, um simples `docker-compose up` será suficiente).*

### 3. Executando a Interface Web (Frontend)
Abra outro terminal, e acesse o diretório local do app React:
```bash
cd sistema-ponto-v2
npm install
npm run dev
```

### 4. Links de Acesso
O ambiente estará rodando imediatamente em:
* **Interface React (Frontend):** `http://localhost:5173`
* **Swagger (Documentação C#):** `http://localhost:8080/swagger`

---

## Credenciais Padrão do Sistema
O Backend é inteligente e faz um "Seed" (Plantio) automático da base de dados se estiver vazia. Para acessar instantaneamente:

* **Login (Matrícula da Conta Admin):** `admin`
* **Senha:** `admin123`

---
🔗 **Link do Repositório GitHub Oficial:** [https://github.com/herethere04/sistema-ponto-api/tree/v2-react](https://github.com/herethere04/sistema-ponto-api/tree/v2-react)
