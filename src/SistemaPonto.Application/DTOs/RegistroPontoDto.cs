namespace SistemaPonto.Application.DTOs;

public class RegistroPontoDto
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string TipoRegistro { get; set; } = string.Empty;
    public int UsuarioId { get; set; }
}