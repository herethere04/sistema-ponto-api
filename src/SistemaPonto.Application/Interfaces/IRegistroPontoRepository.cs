using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Application.Interfaces;

public interface IRegistroPontoRepository
{
    Task<RegistroPonto> AdicionarAsync(RegistroPonto registroPonto);
    Task<RegistroPonto?> ObterUltimoRegistroDoDiaAsync(int usuarioId);
    Task<IEnumerable<RegistroPonto>> ObterHistoricoUsuarioAsync(int usuarioId);
}