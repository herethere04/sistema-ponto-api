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

// --- MOCK: REGISTRAR PONTO (APENAS PARA TESTE VISUAL) ---
async function handleRegisterPoint() {
    // Simula o envio para a API
    showToast("Conectando ao servidor...", "info");

    // Espera 1.5 segundos para fingir que está processando
    setTimeout(() => {
        // Simula SUCESSO (Pode mudar para testar erro)
        const sucesso = true; 

        if (sucesso) {
            const agora = new Date().toLocaleTimeString('pt-BR');
            showToast(`✅ Ponto registrado com sucesso às ${agora}!`, "success");
        } else {
            showToast("❌ Erro ao registrar ponto. Tente novamente.", "error");
        }
    }, 1500);
}

// --- FUNÇÃO: LOGOUT ---
function handleLogout() {
    localStorage.removeItem('jwt_token');
    alert("Você foi desconectado.");
    renderSelectionScreen();
}

function renderEmployeeDashboard() {
    // --- MOCK: Simulando que o funcionário entrou às 08:00 hoje ---
    const hoje = new Date();
    hoje.setHours(8, 0, 0, 0); // Define 08:00:00
    const horaEntradaMock = hoje; 
    // -------------------------------------------------------------

    const dashboardHTML = `
        <div class="container">
            <h1>Ponto Eletrônico</h1>
            
            <div class="clock-container">
                <div id="clock-time" class="clock-time">--:--:--</div>
                <div id="clock-date" class="clock-date">---</div>
            </div>

            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">Horas Trabalhadas Hoje</div>
                    <div id="worked-hours" class="info-value highlight">--:--:--</div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">
                        (Entrada simulada às 08:00)
                    </div>
                </div>
            </div>

            <p>Registre sua jornada de trabalho abaixo.</p>
            
            <div class="btn-group">
                <button id="register-point-btn" class="btn btn-primary" style="padding: 1.2rem; font-size: 1.2rem;">
                    Registrar Ponto
                </button>
                <button id="logout-btn" class="btn">Sair (Logout)</button>
            </div>
        </div>
    `;
    appContainer.innerHTML = dashboardHTML;

    document.getElementById('register-point-btn').addEventListener('click', handleRegisterPoint);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // --- LÓGICA DE ATUALIZAÇÃO ---
    function updateClock() {
        const now = new Date();
        
        // 1. Atualiza Relógio Principal
        const timeElement = document.getElementById('clock-time');
        if (timeElement) {
            timeElement.innerText = now.toLocaleTimeString('pt-BR');
            const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
            document.getElementById('clock-date').innerText = now.toLocaleDateString('pt-BR', dateOptions);
        }

        // 2. Atualiza "Horas Trabalhadas" (Cálculo do Mock)
        const diffMs = now - horaEntradaMock; // Diferença em milissegundos
        
        // Se a diferença for positiva (já passou das 8h), calcula. Senão mostra 00:00
        if (diffMs > 0) {
            const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
            const diffSecs = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000);

            // Formata para sempre ter 2 dígitos (ex: 09:05:01)
            const format = (num) => num.toString().padStart(2, '0');
            const workedString = `${format(diffHrs)}:${format(diffMins)}:${format(diffSecs)}`;
            
            const workedEl = document.getElementById('worked-hours');
            if (workedEl) workedEl.innerText = workedString;
        } else {
            document.getElementById('worked-hours').innerText = "00:00:00";
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
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

// --- MOCK: CARREGAR LISTA DE FUNCIONÁRIOS (DADOS FALSOS) ---
async function loadEmployeeList() {
    const employeeListDiv = document.getElementById('employee-list');
    if (!employeeListDiv) return;

    // Simula um carregamento
    employeeListDiv.innerHTML = '<p style="color: #8e8e93;">Carregando dados...</p>';

    setTimeout(() => {
        // Dados falsos para teste visual
        const usuariosMock = [
            { id: 1, nomeCompleto: 'Áquila Barbosa', matricula: '1001', status: 'ATIVO' },
            { id: 2, nomeCompleto: 'João Silva', matricula: '1002', status: 'INATIVO' },
            { id: 3, nomeCompleto: 'Maria Oliveira', matricula: '1003', status: 'ATIVO' },
            { id: 4, nomeCompleto: 'Carlos Souza', matricula: '1004', status: 'ATIVO' }
        ];

        let listHTML = '<ul style="list-style: none; padding: 0;">';
        
        usuariosMock.forEach(user => {
            // Lógica do Badge: Escolhe a cor baseada no status
            const badgeClass = user.status === 'ATIVO' ? 'badge-ativo' : 'badge-inativo';
            
            // Botão de ação: Se ativo mostra "Desativar", se inativo não mostra nada
            const actionButton = user.status === 'ATIVO' 
                ? `<button class="btn-desativar" onclick="showToast('Simulação: Usuário ${user.id} desativado!', 'info')" style="padding: 6px 12px; font-size: 0.85rem; background-color: transparent; border: 1px solid #ff453a; color: #ff453a; border-radius: 6px; cursor: pointer;">Desativar</button>` 
                : '';

            listHTML += `
                <li style="margin-bottom: 10px; padding: 15px; background-color: #3a3a3c; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #48484a;">
                    <div>
                        <div style="font-weight: 600; font-size: 1.1rem; color: #fff; margin-bottom: 4px;">${user.nomeCompleto}</div>
                        <div style="font-size: 0.9rem; color: #aeaeb2;">
                            Matrícula: ${user.matricula} &nbsp;|&nbsp; 
                            <span class="badge ${badgeClass}">${user.status}</span>
                        </div>
                    </div>
                    ${actionButton}
                </li>
            `;
        });
        
        listHTML += '</ul>';
        employeeListDiv.innerHTML = listHTML;

    }, 500); // Delay de 0.5s para parecer real
}


// --- FUNÇÃO ATUALIZADA: RENDERIZAR DASHBOARD DO ADMIN ---
function renderAdminDashboard() {
    const dashboardHTML = `
        <div class="container" style="max-width: 800px;">
            <h1>Dashboard do Administrador</h1>
            
            <div style="background-color: #2c2c2e; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: left;">
                <h3 style="margin-top: 0;">Cadastrar Novo Funcionário</h3>
                <form id="create-user-form" style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr; align-items: end;">
                    <div class="form-group" style="margin: 0;">
                        <label for="new-nome">Nome Completo</label>
                        <input type="text" id="new-nome" class="form-control" required>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label for="new-matricula">Matrícula</label>
                        <input type="text" id="new-matricula" class="form-control" required>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label for="new-senha">Senha Inicial</label>
                        <input type="text" id="new-senha" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="height: 46px;">Cadastrar</button>
                </form>
            </div>

            <p>Lista de Funcionários Cadastrados:</p>
            <div id="employee-list" style="text-align: left; margin-bottom: 2rem; max-height: 400px; overflow-y: auto; background-color: #2c2c2e; padding: 10px; border-radius: 8px;">
                Carregando lista...
            </div>

            <div class="btn-group">
                <button id="logout-btn" class="btn">Sair (Logout)</button>
            </div>
        </div>
    `;
    appContainer.innerHTML = dashboardHTML;

    // Event Listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Lógica de Cadastro
    document.getElementById('create-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreateUser();
    });

    loadEmployeeList();
}

// --- NOVA FUNÇÃO: CADASTRAR USUÁRIO (CHAMADA PELO FORMULÁRIO) ---
async function handleCreateUser() {
    const token = localStorage.getItem('jwt_token');
    const nome = document.getElementById('new-nome').value;
    const matricula = document.getElementById('new-matricula').value;
    const senha = document.getElementById('new-senha').value;

    // Nota: O backend espera "CriarUsuarioDto". Precisamos ver se o backend pede "Perfil"
    // Assumindo que o padrão do backend é criar "Funcionário" se não especificarmos, ou mandamos Perfil = 1 (Funcionario)
    const payload = {
        nomeCompleto: nome,
        matricula: matricula,
        senha: senha,
        perfil: 1 // 1 = Funcionario (Baseado no seu Enum padrão, verifique se é 0 ou 1 no C#)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Funcionário cadastrado com sucesso!');
            document.getElementById('create-user-form').reset(); // Limpa o formulário
            loadEmployeeList(); // Atualiza a lista na hora
        } else {
            const errorData = await response.json();
            alert(`Erro ao cadastrar: ${errorData.message || 'Verifique os dados.'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao cadastrar usuário.');
    }
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
// --- FUNÇÃO AUXILIAR: EXIBIR TOAST ---
function showToast(message, type = 'success') {
    // 1. Cria o container se não existir
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Cria o elemento da notificação
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    // 3. Adiciona ao container
    container.appendChild(toast);

    // 4. Animação de entrada (precisa de um pequeno delay para o CSS transition funcionar)
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 5. Remove automaticamente após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show'); // Animação de saída
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300); // Espera a animação CSS terminar
    }, 3000);
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
//document.addEventListener('DOMContentLoaded', renderSelectionScreen);

// Adicione esta temporária para o trabalho:
document.addEventListener('DOMContentLoaded', () => {
    console.warn("MODO MOCK ATIVADO: Pulando login...");
    // Finge que tem token
    localStorage.setItem('jwt_token', 'token_falso');
    // Vai direto para a tela do funcionário
    renderAdminDashboard();
});