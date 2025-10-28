const appContainer = document.getElementById('app');
const API_BASE_URL = 'http://localhost:8080/api';

// --- FUNÇÃO: DECODIFICADOR DE JWT ---
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return null;
    }
}

// --- FUNÇÃO: REGISTRAR PONTO ---
async function handleRegisterPoint() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        alert("Sessão expirada. Por favor, faça o login novamente.");
        renderSelectionScreen();
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/ponto/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            const time = new Date(data.timestamp).toLocaleTimeString('pt-BR');
            alert(`Ponto de ${data.tipoRegistro} registrado com sucesso às ${time}.`);
        } else if (response.status === 401) {
            alert("Sessão inválida. Por favor, faça o login novamente.");
            handleLogout();
        } else {
            const errorData = await response.json();
            alert(`Erro ao registrar ponto: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro de rede ao registrar ponto:', error);
        alert('Não foi possível conectar à API para registrar o ponto.');
    }
}

// --- FUNÇÃO: LOGOUT ---
function handleLogout() {
    localStorage.removeItem('jwt_token');
    alert("Você foi desconectado.");
    renderSelectionScreen();
}

// --- FUNÇÃO: RENDERIZAR DASHBOARD DO FUNCIONÁRIO ---
function renderEmployeeDashboard() {
    const dashboardHTML = `
        <div class="container">
            <h1>Dashboard do Funcionário</h1>
            <p>Bem-vindo! Clique no botão abaixo para registrar sua entrada ou saída.</p>
            <div class="btn-group">
                <button id="register-point-btn" class="btn btn-primary">Registrar Ponto</button>
                <button id="logout-btn" class="btn">Sair (Logout)</button>
            </div>
        </div>
    `;
    appContainer.innerHTML = dashboardHTML;
    document.getElementById('register-point-btn').addEventListener('click', handleRegisterPoint);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// --- FUNÇÃO: RENDERIZAR LOGIN DO FUNCIONÁRIO ---
function renderLoginScreen() {
    const loginHTML = `
        <div class="container">
            <h1>Login do Funcionário</h1>
            <p>Use sua matrícula e senha para entrar.</p>
            <form id="login-form">
                <div class="form-group"><label for="matricula">Matrícula</label><input type="text" id="matricula" name="matricula" class="form-control" required></div>
                <div class="form-group"><label for="senha">Senha</label><input type="password" id="senha" name="senha" class="form-control" required></div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
            </form>
            <p style="margin-top: 1.5rem;"><a href="#" id="back-to-selection">Voltar</a></p>
        </div>
    `;
    appContainer.innerHTML = loginHTML;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const matricula = document.getElementById('matricula').value;
        const senha = document.getElementById('senha').value;
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula, senha }),
            });
            if (response.ok) {
                const data = await response.json();
                const tokenPayload = parseJwt(data.token);
                if (tokenPayload && tokenPayload.role === "FUNCIONARIO") {
                    localStorage.setItem('jwt_token', data.token);
                    renderEmployeeDashboard();
                } else {
                    if (tokenPayload) {
                         alert('Erro: Você é um Administrador. Use o login de Administrador.');
                    } else {
                         alert('Erro ao processar o token de autenticação.');
                    }
                }
            } else {
                const errorData = await response.json();
                alert(`Falha no login: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro de rede no login:', error);
            alert('Não foi possível conectar à API. Verifique se o Docker está rodando.');
        }
    });
    document.getElementById('back-to-selection').addEventListener('click', (e) => {
        e.preventDefault();
        renderSelectionScreen();
    });
}

// --- ***** NOVA FUNÇÃO ***** ---
// --- FUNÇÃO: DESATIVAR USUÁRIO ---
async function handleDeactivateUser(userId) {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        alert("Sessão expirada. Faça o login novamente.");
        renderSelectionScreen();
        return;
    }

    // Pede confirmação antes de desativar
    if (!confirm(`Tem certeza que deseja desativar o usuário com ID: ${userId}?`)) {
        return; // Cancela se o usuário clicar em "Não"
    }

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/desativar`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
                // Não precisamos de 'Content-Type' pois não estamos enviando corpo
            }
        });

        if (response.ok) {
            alert(`Usuário ${userId} desativado com sucesso!`);
            loadEmployeeList(); // Recarrega a lista para mostrar o status atualizado
        } else if (response.status === 401 || response.status === 403) {
            alert("Erro: Acesso não autorizado para desativar usuário.");
            handleLogout();
        } else if (response.status === 404) {
             alert("Erro: Usuário não encontrado.");
        } else {
            // Tenta ler a mensagem de erro da API, se houver
            let errorMsg = 'Erro desconhecido ao desativar usuário.';
            try {
                 const errorData = await response.json();
                 errorMsg = errorData.message || errorMsg;
            } catch(e) { /* Ignora se não conseguir ler o JSON */ }
            alert(`Erro ${response.status} ao desativar usuário: ${errorMsg}`);
        }
    } catch (error) {
        console.error('Erro de rede ao desativar usuário:', error);
        alert('Não foi possível conectar à API para desativar o usuário.');
    }
}

// --- FUNÇÃO ATUALIZADA: CARREGAR LISTA DE FUNCIONÁRIOS ---
async function loadEmployeeList() {
    const token = localStorage.getItem('jwt_token');
    const employeeListDiv = document.getElementById('employee-list');

    if (!employeeListDiv) return;

    if (!token) {
        employeeListDiv.innerHTML = '<p style="color: red;">Erro: Você não está autenticado.</p>';
        return;
    }

    employeeListDiv.innerHTML = '<p>Carregando lista...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const usuarios = await response.json();
            if (usuarios.length === 0) {
                employeeListDiv.innerHTML = '<p>Nenhum funcionário cadastrado.</p>';
                return;
            }

            let listHTML = '<ul style="list-style: none; padding: 0;">';
            usuarios.forEach(user => {
                listHTML += `
                    <li style="margin-bottom: 10px; padding: 15px; background-color: #3a3a3c; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${user.nomeCompleto}</strong> <br>
                            <small>(Matrícula: ${user.matricula}) - Status: ${user.status}</small>
                        </div>
                        ${user.status === 'ATIVO' ? `<button class="btn btn-desativar" data-userid="${user.id}" style="padding: 5px 10px; font-size: 0.9em; background-color: #ff3b30; color: white; border: none; border-radius: 5px; cursor: pointer;">Desativar</button>` : '<span style="color: #8e8e93;">Inativo</span>'}
                    </li>
                `;
            });
            listHTML += '</ul>';
            employeeListDiv.innerHTML = listHTML;

            // ***** ATUALIZAÇÃO AQUI: Chama handleDeactivateUser ao clicar *****
            document.querySelectorAll('.btn-desativar').forEach(button => {
                button.addEventListener('click', () => {
                    const userId = button.getAttribute('data-userid');
                    handleDeactivateUser(userId); // Chama a nova função
                });
            });

        } else if (response.status === 401 || response.status === 403) {
            employeeListDiv.innerHTML = '<p style="color: red;">Erro: Acesso não autorizado para visualizar a lista.</p>';
            handleLogout();
        } else {
            const errorData = await response.json().catch(() => ({}));
            employeeListDiv.innerHTML = `<p style="color: red;">Erro ${response.status} ao carregar a lista: ${errorData.message || 'Erro desconhecido'}</p>`;
        }

    } catch (error) {
        console.error('Erro de rede ao buscar funcionários:', error);
        employeeListDiv.innerHTML = '<p style="color: red;">Não foi possível conectar à API.</p>';
    }
}


// --- FUNÇÃO: RENDERIZAR DASHBOARD DO ADMIN ---
function renderAdminDashboard() {
     const dashboardHTML = `
        <div class="container" style="max-width: 600px;">
            <h1>Dashboard do Administrador</h1>
            <p>Lista de Funcionários Cadastrados:</p>
            <div id="employee-list" style="text-align: left; margin-bottom: 2rem; max-height: 400px; overflow-y: auto; background-color: #2c2c2e; padding: 10px; border-radius: 8px;">Carregando lista de funcionários...</div>
            <div class="btn-group" style="margin-top: 20px;">
                <button id="logout-btn" class="btn">Sair (Logout)</button>
            </div>
        </div>
    `;
    appContainer.innerHTML = dashboardHTML;
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    loadEmployeeList();
}

// --- FUNÇÃO: RENDERIZAR LOGIN DO ADMIN ---
function renderAdminLoginScreen() {
    const loginHTML = `
        <div class="container">
            <h1>Login do Administrador</h1>
            <p>Use sua matrícula e senha de admin para entrar.</p>
            <form id="login-form">
                <div class="form-group"><label for="matricula">Matrícula</label><input type="text" id="matricula" name="matricula" class="form-control" required></div>
                <div class="form-group"><label for="senha">Senha</label><input type="password" id="senha" name="senha" class="form-control" required></div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
            </form>
            <p style="margin-top: 1.5rem;"><a href="#" id="back-to-selection">Voltar</a></p>
        </div>
    `;
    appContainer.innerHTML = loginHTML;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const matricula = document.getElementById('matricula').value;
        const senha = document.getElementById('senha').value;
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula, senha }),
            });
            if (response.ok) {
                const data = await response.json();
                const tokenPayload = parseJwt(data.token);
                if (tokenPayload && tokenPayload.role === "ADMIN") {
                    localStorage.setItem('jwt_token', data.token);
                    renderAdminDashboard();
                } else {
                    if (tokenPayload) {
                        alert('Erro: Você é um Funcionário. Use o login de Funcionário.');
                    } else {
                         alert('Erro ao processar o token de autenticação.');
                    }
                }
            } else {
                const errorData = await response.json();
                alert(`Falha no login: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro de rede no login:', error);
            alert('Não foi possível conectar à API. Verifique se o Docker está rodando.');
        }
    });

    document.getElementById('back-to-selection').addEventListener('click', (e) => {
        e.preventDefault();
        renderSelectionScreen();
    });
}

// --- FUNÇÃO: RENDERIZAR TELA DE SELEÇÃO INICIAL ---
function renderSelectionScreen() {
    const selectionHTML = `
        <div class="container">
            <h1>Sistema de Ponto</h1>
            <p>Selecione seu perfil para continuar.</p>
            <div class="btn-group">
                <a href="#" id="admin-btn" class="btn">Administrador</a>
                <a href="#" id="employee-btn" class="btn">Funcionário</a>
            </div>
        </div>
    `;
    appContainer.innerHTML = selectionHTML;

    document.getElementById('employee-btn').addEventListener('click', (event) => {
        event.preventDefault();
        renderLoginScreen();
    });

    document.getElementById('admin-btn').addEventListener('click', (event) => {
        event.preventDefault();
        renderAdminLoginScreen();
    });
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', renderSelectionScreen);