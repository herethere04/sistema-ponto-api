// Arquivo: src/SistemaPonto.Domain/Entities/Usuario.cs
namespace SistemaPonto.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public TipoUsuarioEnum TipoUsuario { get; set; }
    public StatusUsuarioEnum Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum TipoUsuarioEnum
{
    FUNCIONARIO,
    ADMIN
}

public enum StatusUsuarioEnum
{
    ATIVO,
    INATIVO
}