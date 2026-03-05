import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Hourglass } from 'lucide-react';
import { getHistoricoPonto } from '../services/api';

const Historico = () => {
    const [pontos, setPontos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saldoHoras, setSaldoHoras] = useState("00:00");

    useEffect(() => {
        const fetchHistorico = async () => {
            try {
                const registrosData = await getHistoricoPonto();

                // Agrupando por dia
                const pontosPorDia = {};
                registrosData.forEach(p => {
                    const d = new Date(p.timestamp);
                    const dataLocal = d.toLocaleDateString('en-CA'); // YYYY-MM-DD local
                    const horaLocal = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    if (!pontosPorDia[dataLocal]) pontosPorDia[dataLocal] = { id: dataLocal, data: dataLocal, entrada: '--:--', saida: '--:--' };

                    if (p.tipoRegistro === 'ENTRADA') pontosPorDia[dataLocal].entrada = horaLocal;
                    if (p.tipoRegistro === 'SAIDA') pontosPorDia[dataLocal].saida = horaLocal;
                });

                const dadosReais = Object.values(pontosPorDia).sort((a, b) => b.data.localeCompare(a.data));
                setPontos(dadosReais);

                // Lógica de Soma de Horas
                let totalMinutosTrabalhados = 0;

                dadosReais.forEach(p => {
                    if (p.entrada !== '--:--' && p.saida !== '--:--') {
                        const [eH, eM] = p.entrada.split(':').map(Number);
                        const [sH, sM] = p.saida.split(':').map(Number);

                        const minutosEntrada = (eH * 60) + eM;
                        const minutosSaida = (sH * 60) + sM;

                        // Assumindo entradas e saídas no mesmo dia
                        let diff = minutosSaida - minutosEntrada;
                        if (diff < 0) diff += 24 * 60; // Virou a noite

                        totalMinutosTrabalhados += diff;
                    }
                });

                const horasAteHoje = dadosReais.length * 8; // (8 horas por dia)
                const totalHorasAteHojeMin = horasAteHoje * 60;

                const saldoMinutos = totalMinutosTrabalhados - totalHorasAteHojeMin;
                const saldoString = `${saldoMinutos >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(saldoMinutos) / 60)).padStart(2, '0')}:${String(Math.abs(saldoMinutos) % 60).padStart(2, '0')}`;

                setSaldoHoras(saldoString);
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, []);

    return (
        <div style={{ color: '#f2f2f7' }}>
            {/* Cabeçalho */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>Meu Histórico</h1>
                <p style={{ color: '#8e8e93' }}>Acompanhe seus registros e saldo de horas do mês.</p>
            </div>

            {/* Grid de Dashboards Menores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>

                <div style={{
                    backgroundColor: '#2c2c2e', padding: '24px', borderRadius: '16px', border: '1px solid #3a3a3c',
                    display: 'flex', alignItems: 'center', gap: '20px'
                }}>
                    <div style={{ backgroundColor: 'rgba(10, 132, 255, 0.15)', padding: '16px', borderRadius: '12px', color: '#0A84FF' }}>
                        <CalendarDays size={32} />
                    </div>
                    <div>
                        <div style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Dias Trabalhados
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f2f2f7' }}>
                            {loading ? '-' : pontos.length}
                        </div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#2c2c2e', padding: '24px', borderRadius: '16px', border: '1px solid #3a3a3c',
                    display: 'flex', alignItems: 'center', gap: '20px'
                }}>
                    <div style={{ backgroundColor: saldoHoras.startsWith('+') ? 'rgba(50, 215, 75, 0.15)' : 'rgba(255, 69, 58, 0.15)', padding: '16px', borderRadius: '12px', color: saldoHoras.startsWith('+') ? '#32d74b' : '#ff453a' }}>
                        <Hourglass size={32} />
                    </div>
                    <div>
                        <div style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Saldo no Mês
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: saldoHoras.startsWith('+') ? '#32d74b' : '#ff453a', fontFamily: 'monospace' }}>
                            {loading ? '-' : saldoHoras}
                        </div>
                    </div>
                </div>

            </div>

            {/* Tabela de Histórico */}
            <div style={{ backgroundColor: '#2c2c2e', borderRadius: '12px', border: '1px solid #3a3a3c', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #3a3a3c', color: '#8e8e93', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '18px' }}>Data</th>
                            <th style={{ padding: '18px' }}>Entrada</th>
                            <th style={{ padding: '18px' }}>Saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" style={{ padding: '18px', textAlign: 'center', color: '#8e8e93' }}>Calculando histórico...</td></tr>
                        ) : pontos.length === 0 ? (
                            <tr><td colSpan="3" style={{ padding: '18px', textAlign: 'center', color: '#8e8e93' }}>Nenhum registro encontrado neste mês.</td></tr>
                        ) : (
                            pontos.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #3a3a3c', fontSize: '0.95rem' }}>
                                    <td style={{ padding: '18px', fontWeight: '600' }}>{p.data.split('-').reverse().join('/')}</td>
                                    <td style={{ padding: '18px', color: '#8e8e93', fontFamily: 'monospace', fontSize: '1.1rem' }}>{p.entrada}</td>
                                    <td style={{ padding: '18px', color: '#8e8e93', fontFamily: 'monospace', fontSize: '1.1rem' }}>{p.saida}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Historico;
