using Microsoft.EntityFrameworkCore;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Domain.Entities;
using SistemaPonto.Infrastructure.Persistence;

namespace SistemaPonto.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario> AdicionarAsync(Usuario usuario)
    {
        await _context.Usuarios.AddAsync(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task<Usuario?> ObterPorMatriculaAsync(string matricula)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Matricula == matricula);
    }

    public async Task<IEnumerable<Usuario>> ObterTodosAsync()
    {
        // Adicionamos o .Where() para filtrar apenas os funcionários
        return await _context.Usuarios
            .Where(u => u.TipoUsuario == TipoUsuarioEnum.FUNCIONARIO)
            .ToListAsync();
    }

    // --- MÉTODOS ADICIONADOS ---
    public async Task<Usuario?> ObterPorIdAsync(int id)
    {
        return await _context.Usuarios
                             .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task AtualizarAsync(Usuario usuario)
    {
        _context.Usuarios.Update(usuario);
        await _context.SaveChangesAsync();
    }
    // ---------------------------
}