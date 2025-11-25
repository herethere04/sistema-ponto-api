# Sistema Simplificado de Ponto (Branch: Main / Infra) 🚧

![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)
![CI/CD](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Status](https://img.shields.io/badge/Status-Configuração%20de%20Infraestrutura-orange?style=for-the-badge)

> ⚠️ **ATENÇÃO:** Esta branch (`main`) está sendo utilizada exclusivamente para **configuração de infraestrutura em nuvem (Azure)** e testes de **CI/CD**. O código aqui pode conter configurações específicas de nuvem que não rodam imediatamente em ambiente local.

---

## 🎯 Onde está o projeto funcional para testes locais?

Se você deseja **rodar e testar o sistema na sua máquina** (versão estável apresentável com Docker Compose), por favor, alterne para a branch **MVP**.

### Como acessar a versão estável (MVP):

No seu terminal, execute os seguintes comandos:

```bash
# 1. Baixe todas as referências do repositório
git fetch --all

# 2. Mude para a branch do MVP
git checkout MVP

## 🛠️ O que está sendo feito nesta branch (`main`)?

Estamos migrando a arquitetura do sistema de uma execução local monolítica para uma arquitetura moderna de **microsserviços serverless na nuvem Microsoft Azure**.

### Arquitetura e Infraestrutura Cloud:
* **Backend (API):** Hospedado no **Azure Container Apps**. A API escala automaticamente e roda em ambiente isolado.
* **Banco de Dados:** PostgreSQL rodando como um container seguro dentro do mesmo **Azure Container Apps Environment** da API. A comunicação é feita via rede privada interna (TCP), sem exposição para a internet pública.
* **Frontend:** Hospedado no **Azure Static Web Apps**, garantindo distribuição global e alta performance.
* **DevOps (CI/CD):** Pipeline completa com **GitHub Actions**. A cada `push` nesta branch, o código é compilado, a imagem Docker é construída e o ambiente de produção é atualizado automaticamente.

### Estrutura de Branches do Projeto

| Branch | Status | Objetivo |
| :--- | :--- | :--- |
| **`MVP`** | 🟢 **Estável** | Versão funcional para rodar localmente com Docker Compose. Use esta para testes, validação e apresentações. |
| **`main`** | 🟠 **Em Configuração** | Foco em Infraestrutura, Azure e Automação. Contém configurações de produção (Cloud). |
| **`v2-react`** | 🔵 **Em Desenvolvimento** | Nova interface moderna sendo construída em React.js com melhorias de UX/UI. |
