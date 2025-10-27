using SistemaPonto.Application.DTOs;

namespace SistemaPonto.Application.Interfaces;

public interface IUsuarioService
{
    Task<UsuarioDto> CriarAsync(CriarUsuarioDto criarUsuarioDto);
    Task<string> AutenticarAsync(LoginDto loginDto);
    Task<IEnumerable<UsuarioDto>> ObterTodosAsync();
    // Futuramente teremos outros métodos aqui: AutenticarAsync, DesativarAsync, etc.
    Task<UsuarioDto> DesativarAsync(int id);
}