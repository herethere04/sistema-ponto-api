// Arquivo: src/SistemaPonto.Domain/Entities/RegistroPonto.cs
namespace SistemaPonto.Domain.Entities;

public class RegistroPonto
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public TipoRegistroEnum TipoRegistro { get; set; }

    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}

public enum TipoRegistroEnum
{
    ENTRADA,
    SAIDA
}