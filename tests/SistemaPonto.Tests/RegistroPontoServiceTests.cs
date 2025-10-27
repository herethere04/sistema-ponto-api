using Moq;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Application.Services;
using SistemaPonto.Domain.Entities;
using Xunit;

namespace SistemaPonto.Tests;

public class RegistroPontoServiceTests
{
    private readonly Mock<IRegistroPontoRepository> _mockRepo;
    private readonly RegistroPontoService _service;

    // Construtor para inicializar o mock e o serviço para todos os testes
    public RegistroPontoServiceTests()
    {
        _mockRepo = new Mock<IRegistroPontoRepository>();
        _service = new RegistroPontoService(_mockRepo.Object);
    }
    
    [Fact]
    public async Task RegistrarPonto_SemRegistrosAnteriores_DeveRegistrarComoEntrada()
    {
        // Arrange
        var usuarioId = 1;

        _mockRepo.Setup(r => r.ObterUltimoRegistroDoDiaAsync(usuarioId))
                 .ReturnsAsync((RegistroPonto?)null);

        _mockRepo.Setup(r => r.AdicionarAsync(It.IsAny<RegistroPonto>()))
                 .ReturnsAsync((RegistroPonto rp) => rp);

        // Act
        var resultado = await _service.RegistrarPontoAsync(usuarioId);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal("ENTRADA", resultado.TipoRegistro);
    }

    [Fact]
    public async Task RegistrarPonto_ComEntradaAnterior_DeveRegistrarComoSaida()
    {
        // Arrange
        var usuarioId = 1;
        var ultimoRegistro = new RegistroPonto { TipoRegistro = TipoRegistroEnum.ENTRADA };

        _mockRepo.Setup(r => r.ObterUltimoRegistroDoDiaAsync(usuarioId))
                 .ReturnsAsync(ultimoRegistro);

        _mockRepo.Setup(r => r.AdicionarAsync(It.IsAny<RegistroPonto>()))
                 .ReturnsAsync((RegistroPonto rp) => rp);

        // Act
        var resultado = await _service.RegistrarPontoAsync(usuarioId);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal("SAIDA", resultado.TipoRegistro);
    }

    [Fact]
    public async Task RegistrarPonto_ComSaidaAnterior_DeveRegistrarComoEntrada()
    {
        // Arrange
        var usuarioId = 1;
        var ultimoRegistro = new RegistroPonto { TipoRegistro = TipoRegistroEnum.SAIDA };

        _mockRepo.Setup(r => r.ObterUltimoRegistroDoDiaAsync(usuarioId))
                 .ReturnsAsync(ultimoRegistro);

        _mockRepo.Setup(r => r.AdicionarAsync(It.IsAny<RegistroPonto>()))
                 .ReturnsAsync((RegistroPonto rp) => rp);

        // Act
        var resultado = await _service.RegistrarPontoAsync(usuarioId);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal("ENTRADA", resultado.TipoRegistro);
    }
}