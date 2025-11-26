const appContainer = document.getElementById('app');
const API_BASE_URL = 'http://localhost:8080/api'; // Ajuste se for nuvem

// --- UTILITÁRIOS ---

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return null; }
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { if(toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 3000);
}

function handleLogout() {
    localStorage.removeItem('jwt_token');
    renderSelectionScreen();
    showToast("Logout realizado.", "success");
}

// --- FUNCIONÁRIO ---

async function handleRegisterPoint() {
    const token = localStorage.getItem('jwt_token');
    if (!token) { showToast("Sessão expirada.", "error"); renderSelectionScreen(); return; }

    try {
        const response = await fetch(`${API_BASE_URL}/ponto/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            const time = new Date(data.timestamp).toLocaleTimeString('pt-BR');
            showToast(`✅ Ponto de ${data.tipoRegistro} registrado às ${time}!`, "success");
        } else {
            const errorData = await response.json();
            showToast(`❌ ${errorData.message}`, "error");
            if (response.status === 401) handleLogout();
        }
    } catch (error) { showToast('Erro de conexão.', 'error'); }
}

function renderEmployeeDashboard() {
    // Mock da hora de entrada para visualização
    const hoje = new Date();
    hoje.setHours(8, 0, 0, 0);
    const horaEntradaMock = hoje; 

    const dashboardHTML = `
        <div class="container container-dashboard">
            <h1>Ponto Eletrônico</h1>
            <div class="clock-container">
                <div id="clock-time" class="clock-time">--:--:--</div>
                <div id="clock-date" class="clock-date">---</div>
            </div>
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">Horas Trabalhadas</div>
                    <div id="worked-hours" class="info-value highlight">--:--:--</div>
                </div>
            </div>
            <p>Registre sua jornada:</p>
            <div class="btn-group">
                <button id="register-point-btn" class="btn btn-primary" style="padding: 1.2rem; font-size: 1.2rem;">Registrar Ponto</button>
                <button id="logout-btn" class="btn btn-secondary">Sair</button>
            </div>
        </div>
    `;
    appContainer.innerHTML = dashboardHTML;
    document.getElementById('register-point-btn').addEventListener('click', handleRegisterPoint);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    function updateClock() {
        const now = new Date();
        const timeEl = document.getElementById('clock-time');
        if (timeEl) {
            timeEl.innerText = now.toLocaleTimeString('pt-BR');
            document.getElementById('clock-date').innerText = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        }
        // Calculo mockado
        const diffMs = now - horaEntradaMock;
        if (diffMs > 0) {
            const diffHrs = Math.floor((diffMs % 86400000) / 3600000).toString().padStart(2, '0');
            const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000).toString().padStart(2, '0');
            const diffSecs = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000).toString().padStart(2, '0');
            const workedEl = document.getElementById('worked-hours');
            if(workedEl) workedEl.innerText = `${diffHrs}:${diffMins}:${diffSecs}`;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// --- ADMIN ---

async function loadEmployeeList() {
    const token = localStorage.getItem('jwt_token');
    const listDiv = document.getElementById('employee-list');
    if (!listDiv) return;
    
    listDiv.innerHTML = '<p style="color: #8e8e93;">Carregando...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'GET', headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const usuarios = await response.json();
            
            if (usuarios.length === 0) { 
                listDiv.innerHTML = '<p>Nenhum funcionário.</p>'; 
                return; 
            }

            usuarios.sort((a, b) => {
                // 1. Prioridade: ATIVO vem antes de INATIVO
                if (a.status === 'ATIVO' && b.status !== 'ATIVO') return -1;
                if (a.status !== 'ATIVO' && b.status === 'ATIVO') return 1;
                
                // 2. Desempate: Ordem Alfabética
                return a.nomeCompleto.localeCompare(b.nomeCompleto);
            });

            let listHTML = '<ul style="list-style: none; padding: 0;">';
            
            usuarios.forEach(user => {
                const badgeClass = user.status === 'ATIVO' ? 'badge-ativo' : 'badge-inativo';
                
                // Botão só aparece se estiver ativo
                const actionBtn = user.status === 'ATIVO' 
                    ? `<button class="btn-desativar" data-id="${user.id}">Desativar</button>`
                    : '';

                // Efeito visual: Inativos ficam levemente mais transparentes
                const opacityStyle = user.status === 'ATIVO' ? 'opacity: 1;' : 'opacity: 0.6;';

                listHTML += `
                    <li style="margin-bottom: 10px; padding: 15px; background-color: #3a3a3c; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #444; ${opacityStyle}">
                        <div style="text-align: left;">
                            <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 4px;">${user.nomeCompleto}</div>
                            <div style="font-size: 0.9rem; color: #aeaeb2;">Matrícula: ${user.matricula} | <span class="badge ${badgeClass}">${user.status}</span></div>
                        </div>
                        ${actionBtn}
                    </li>`;
            });
            
            listHTML += '</ul>';
            listDiv.innerHTML = listHTML;
            
            // Re-ativa os listeners dos botões
            document.querySelectorAll('.btn-desativar').forEach(btn => {
                btn.addEventListener('click', () => handleDeactivateUser(btn.getAttribute('data-id')));
            });

        } else { 
            if(response.status === 401) handleLogout(); 
        }
    } catch (error) { 
        listDiv.innerHTML = '<p style="color: #ff453a;">Erro de conexão.</p>'; 
    }
}

async function handleCreateUser() {
    const token = localStorage.getItem('jwt_token');
    const nome = document.getElementById('new-nome').value;
    const matricula = document.getElementById('new-matricula').value;
    const senha = document.getElementById('new-senha').value;
    
    if (!nome || !matricula || !senha) { showToast("Preencha todos os campos.", "error"); return; }
    
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ nomeCompleto: nome, matricula, senha, perfil: 1 }) // Perfil 1 = Funcionario
        });
        if (response.ok) {
            showToast('Funcionário cadastrado!', 'success');
            document.getElementById('create-user-form').reset();
            loadEmployeeList();
        } else { 
            const err = await response.json(); 
            showToast(`Erro: ${err.message}`, 'error'); 
        }
    } catch (e) { showToast('Erro de conexão.', 'error'); }
}

async function handleDeactivateUser(id) {
    if(!confirm("Deseja desativar?")) return;
    const token = localStorage.getItem('jwt_token');
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}/desativar`, {
            method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }
        });
        if(response.ok) { showToast("Desativado.", "success"); loadEmployeeList(); }
        else { showToast("Erro ao desativar.", "error"); }
    } catch(e) { showToast("Erro de conexão.", "error"); }
}

function renderAdminDashboard() {
    const dashboardHTML = `
        <div class="container container-dashboard">
            <div style="text-align: left; margin-bottom: 30px;">
                <h1 style="margin: 0;">Painel Admin</h1>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Gerenciamento de Funcionários</p>
            </div>

            <div style="background: #2c2c2e; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: left; border: 1px solid #3a3a3c;">
                <h3 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">Cadastrar Funcionário</h3>
                <form id="create-user-form" style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; align-items: end;">
                    <div>
                        <label style="font-size: 0.8rem; color: #8e8e93; display: block; margin-bottom: 4px;">Nome Completo</label>
                        <input type="text" id="new-nome" class="form-control" style="background: #1c1c1e; border: 1px solid #444;">
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; color: #8e8e93; display: block; margin-bottom: 4px;">Matrícula</label>
                        <input type="text" id="new-matricula" class="form-control" style="background: #1c1c1e; border: 1px solid #444;">
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; color: #8e8e93; display: block; margin-bottom: 4px;">Senha Padrão</label>
                        <input type="text" id="new-senha" value="123456" class="form-control" style="background: #1c1c1e; border: 1px solid #444;">
                    </div>
                    
                    <button type="button" id="btn-create-user" class="btn btn-primary">+</button>
                </form>
            </div>

            <div>
                <h3 style="margin-bottom: 15px; text-align: left;">Funcionários Ativos</h3>
                <div id="employee-list">
                    </div>
            </div>
            
            <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; text-align: center;">
                <button id="logout-btn" class="btn btn-primary" style="width: 50%; margin: 0 auto;">
                    Sair do Sistema
                </button>
            </div>
        </div>
    `;
    
    appContainer.innerHTML = dashboardHTML;
    
    // Bind dos eventos
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('btn-create-user').addEventListener('click', handleCreateUser);
    
    // Carrega a lista imediatamente
    loadEmployeeList();
}

function renderLoginScreen(role) {
    const title = role === 'ADMIN' ? 'Administrador' : 'Funcionário';
    
    const loginHTML = `
        <div class="container">
            <h1 style="margin-bottom: 10px;">Login ${title}</h1>
            <p style="margin-bottom: 25px; color: #8e8e93;">Entre com suas credenciais</p>
            
            <form id="login-form" style="text-align: left;">
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #8e8e93;">Matrícula</label>
                    <input type="text" id="matricula" class="form-control" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #444; background: #2c2c2e; color: white;" required>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; color: #8e8e93;">Senha</label>
                    <input type="password" id="senha" class="form-control" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #444; background: #2c2c2e; color: white;" required>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 25px;">
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer; background-color: #0A84FF; border: none; color: white;">
                        Entrar
                    </button>
                    
                    <button type="button" id="back-btn" class="btn" style="width: 100%; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer; background-color: transparent; border: 1px solid #555; color: #8e8e93;">
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    `;
    appContainer.innerHTML = loginHTML;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const matricula = document.getElementById('matricula').value;
        const senha = document.getElementById('senha').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula, senha })
            });

            if (response.ok) {
                const data = await response.json();
                const payload = parseJwt(data.token);
                
                // CORREÇÃO: Tenta pegar a role pelo nome curto OU pelo nome padrão Microsoft
                const userRole = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const normalizedUserRole = userRole ? userRole.toUpperCase() : '';
                
                if (normalizedUserRole === role) {
                    localStorage.setItem('jwt_token', data.token);
                    role === 'ADMIN' ? renderAdminDashboard() : renderEmployeeDashboard();
                } else {
                    showToast(`Login inválido para perfil ${title}.`, "error");
                }
            } else {
                const err = await response.json();
                showToast(`Falha: ${err.message}`, "error");
            }
        } catch (error) {
            showToast("Erro de conexão com o servidor.", "error");
        }
    });

    document.getElementById('back-btn').addEventListener('click', (e) => {
        e.preventDefault(); 
        renderSelectionScreen();
    });
}

function renderSelectionScreen() {
    const selectionHTML = `
        <div class="container">
            <h1>Sistema de Ponto</h1>
            <p>Selecione seu perfil:</p>
            <div class="btn-group">
                <button id="admin-btn" class="btn btn-primary">Administrador</button>
                <button id="employee-btn" class="btn btn-primary">Funcionário</button>
            </div>
        </div>
    `;
    appContainer.innerHTML = selectionHTML;
    document.getElementById('admin-btn').addEventListener('click', () => renderLoginScreen('ADMIN'));
    document.getElementById('employee-btn').addEventListener('click', () => renderLoginScreen('FUNCIONARIO'));
}

document.addEventListener('DOMContentLoaded', renderSelectionScreen);