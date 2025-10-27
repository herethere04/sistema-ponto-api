// Arquivo: src/SistemaPonto.Application/DTOs/UsuarioDto.cs
namespace SistemaPonto.Application.DTOs;

public class UsuarioDto
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public string TipoUsuario { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}