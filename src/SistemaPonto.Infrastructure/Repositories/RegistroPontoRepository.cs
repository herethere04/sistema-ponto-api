using Microsoft.EntityFrameworkCore;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Domain.Entities;
using SistemaPonto.Infrastructure.Persistence;

namespace SistemaPonto.Infrastructure.Repositories;

public class RegistroPontoRepository : IRegistroPontoRepository
{
    private readonly AppDbContext _context;

    public RegistroPontoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RegistroPonto> AdicionarAsync(RegistroPonto registroPonto)
    {
        await _context.RegistrosPonto.AddAsync(registroPonto);
        await _context.SaveChangesAsync();
        return registroPonto;
    }

    public async Task<RegistroPonto?> ObterUltimoRegistroDoDiaAsync(int usuarioId)
    {
        // Pega a data de hoje, ignorando a hora (ex: 14/10/2025 00:00:00)
        var hoje = DateTime.UtcNow.Date;

        // Busca no banco de dados
        return await _context.RegistrosPonto
            // Filtra pelo ID do usuário
            .Where(r => r.UsuarioId == usuarioId && r.Timestamp.Date == hoje)
            // Ordena do mais recente para o mais antigo
            .OrderByDescending(r => r.Timestamp)
            // Pega o primeiro (que será o mais recente) ou null se não houver nenhum
            .FirstOrDefaultAsync();
    }
    public async Task<IEnumerable<RegistroPonto>> ObterHistoricoUsuarioAsync(int usuarioId)
    {
        return await _context.RegistrosPonto
            .Where(r => r.UsuarioId == usuarioId)
            .OrderByDescending(r => r.Timestamp)
            .ToListAsync();
    }
}