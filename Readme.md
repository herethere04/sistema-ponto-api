# Sistema Simplificado de Ponto v1.0

## Descrição

Este projeto implementa um sistema básico para registro de ponto de funcionários, consistindo em uma API backend desenvolvida em C# com .NET 8 e uma interface frontend simples em HTML/CSS/JS. O sistema permite o cadastro de funcionários, autenticação e o registro de horários de entrada e saída. A gestão de funcionários (listar, desativar) é feita por um perfil de Administrador.

Esta versão (v1.0) representa o Produto Mínimo Viável (MVP) do sistema.

## Funcionalidades Principais (v1.0)

* **Funcionário:**
    * Login via Matrícula e Senha.
    * Registro de Entrada e Saída (com validação de sequência).
    * Logout.
* **Administrador:**
    * Login via Matrícula e Senha.
    * Visualizar lista de funcionários cadastrados (excluindo outros admins).
    * Desativar um funcionário (impedindo seu login).
    * Logout.

## Arquitetura e Tecnologias

* **Backend:** C# com .NET 8
* **Arquitetura:** API RESTful seguindo princípios da Clean Architecture (Domain, Application, Infrastructure, Api).
* **Banco de Dados:** PostgreSQL (gerenciado via Docker).
* **ORM:** Entity Framework Core 8.
* **Autenticação:** JWT (JSON Web Tokens).
* **Segurança:** Senhas armazenadas com hashing (BCrypt).
* **Testes:** Testes de unidade com xUnit e Moq.
* **Documentação da API:** Swagger (OpenAPI).
* **Frontend:** HTML, CSS, JavaScript (sem frameworks).
* **Ambiente:** Docker e Docker Compose.

## Pré-requisitos

Para rodar este projeto em ambiente de desenvolvimento, você precisará ter instalado:

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Como Configurar e Rodar o Projeto

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/herethere04/sistema-ponto-api
    cd sistema-ponto-api
    ```
    

2.  **Certifique-se que o Docker Desktop está rodando.**

3.  **Construa e Inicie os Containers:**
    Abra um terminal na pasta raiz do projeto (`sistema-ponto-api`) e execute o comando:
    ```bash
    docker-compose up --build
    ```
    Na primeira vez, o Docker baixará as imagens e construirá a aplicação. Nas vezes seguintes, o `docker-compose up` será suficiente se não houver mudanças no código do backend.

## Acessando a Aplicação

* **Frontend:** Abra o arquivo `frontend/index.html` com a extensão "Live Server" ou "Live Preview" do VS Code, ou diretamente no seu navegador (o endereço será algo como `http://127.0.0.1:5500` se usar o Live Server).
* **API (Swagger):** Acesse `http://localhost:8080/swagger` no seu navegador para ver a documentação da API e testar os endpoints diretamente.

## Credenciais Padrão do Banco de Dados (Docker Compose)

* **Usuário:** `pontouser`
* **Senha:** `pontopass`
* **Banco:** `sistemaponto`
* **Host (dentro do Docker):** `db`
* **Host (acesso externo):** `localhost`
* **Porta:** `5432`

## Próximas Versões (Roadmap)

* Implementar cálculo de horas trabalhadas.
* Frontend: Adicionar funcionalidade de cadastro de usuário pelo Admin.
* Frontend: Criar visualização detalhada do histórico de ponto por funcionário (Admin).
* Frontend: Permitir que o funcionário veja seu próprio histórico/saldo de horas.
* Backend: Implementar funcionalidade para reativar usuários.
* Adicionar mais testes automatizados.
* Configurar ambiente de produção e deploy.