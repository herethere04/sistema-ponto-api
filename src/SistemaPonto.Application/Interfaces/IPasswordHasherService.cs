namespace SistemaPonto.Application.Interfaces;

public interface IPasswordHasherService
{
    string HashPassword(string password);
    bool VerifyPassword(string providedPassword, string passwordHash);
}