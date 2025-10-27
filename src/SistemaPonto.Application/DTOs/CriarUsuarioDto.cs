// Arquivo: src/SistemaPonto.Application/DTOs/CriarUsuarioDto.cs
namespace SistemaPonto.Application.DTOs;

public class CriarUsuarioDto
{
    public string NomeCompleto { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}