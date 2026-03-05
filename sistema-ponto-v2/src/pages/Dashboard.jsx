import React, { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { getUsuarios } from '../services/api';

const Dashboard = () => {
    const [metrics, setMetrics] = useState({ total: 0, ativos: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getUsuarios();

                // Count only Employees for these metrics
                const funcionarios = data.filter(u => u.perfil === 1 || u.role === 'FUNCIONARIO' || u.perfil === undefined);
                const ativos = funcionarios.filter(u => u.status === 'ATIVO' || !u.status).length;

                setMetrics({ total: funcionarios.length, ativos });
            } catch (error) {
                console.error("Erro ao carregar métricas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    return (
        <div style={{ color: '#f2f2f7' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Painel Geral</h1>
                <p style={{ color: '#8e8e93' }}>Visão rápida das métricas do sistema.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

                {/* Card: Total de Funcionários */}
                <div style={{
                    backgroundColor: '#2c2c2e',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #3a3a3c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(10, 132, 255, 0.15)',
                        padding: '16px',
                        borderRadius: '12px',
                        color: '#0A84FF'
                    }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <div style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Total Funcionários
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f2f2f7' }}>
                            {loading ? '-' : metrics.total}
                        </div>
                    </div>
                </div>

                {/* Card: Funcionários Ativos */}
                <div style={{
                    backgroundColor: '#2c2c2e',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #3a3a3c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(50, 215, 75, 0.15)',
                        padding: '16px',
                        borderRadius: '12px',
                        color: '#32d74b'
                    }}>
                        <UserCheck size={32} />
                    </div>
                    <div>
                        <div style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Funcionários Ativos
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f2f2f7' }}>
                            {loading ? '-' : metrics.ativos}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
