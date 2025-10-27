using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(Usuario usuario);
}