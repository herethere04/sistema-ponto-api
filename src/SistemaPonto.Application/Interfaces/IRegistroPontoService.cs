using SistemaPonto.Application.DTOs;

namespace SistemaPonto.Application.Interfaces;

public interface IRegistroPontoService
{
    Task<RegistroPontoDto> RegistrarPontoAsync(int usuarioId);
    Task<IEnumerable<RegistroPontoDto>> ObterHistoricoUsuarioAsync(int usuarioId);
}