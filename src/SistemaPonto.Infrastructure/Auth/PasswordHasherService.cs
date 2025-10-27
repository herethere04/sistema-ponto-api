using SistemaPonto.Application.Interfaces;

namespace SistemaPonto.Infrastructure.Auth;

public class PasswordHasherService : IPasswordHasherService
{
    public string HashPassword(string password)
    {
        // O BCrypt gera o "salt" automaticamente e o embute no hash final
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string providedPassword, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(providedPassword, passwordHash);
    }
}