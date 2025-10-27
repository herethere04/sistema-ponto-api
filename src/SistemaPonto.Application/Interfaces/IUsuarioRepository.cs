using System.Collections.Generic; // Adicionado para IEnumerable
using System.Threading.Tasks; // Adicionado para Task
using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario> AdicionarAsync(Usuario usuario);
    Task<Usuario?> ObterPorMatriculaAsync(string matricula);
    Task<IEnumerable<Usuario>> ObterTodosAsync();
    Task<Usuario?> ObterPorIdAsync(int id); 
    Task AtualizarAsync(Usuario usuario);    
}