using Moq;
using SistemaPonto.Application.DTOs;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Application.Services;
using SistemaPonto.Domain.Entities;
using Xunit;

namespace SistemaPonto.Tests;

public class UsuarioServiceTests
{
    private readonly Mock<IUsuarioRepository> _mockUsuarioRepo;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<IPasswordHasherService> _mockPasswordHasher;
    private readonly UsuarioService _service;

    public UsuarioServiceTests()
    {
        _mockUsuarioRepo = new Mock<IUsuarioRepository>();
        _mockTokenService = new Mock<ITokenService>();
        _mockPasswordHasher = new Mock<IPasswordHasherService>();
        _service = new UsuarioService(_mockUsuarioRepo.Object, _mockTokenService.Object, _mockPasswordHasher.Object);
    }

    [Fact]
    public async Task CriarAsync_ComMatriculaJaExistente_DeveLancarExcecao()
    {
        // Arrange
        var criarUsuarioDto = new CriarUsuarioDto { Matricula = "123" };
        var usuarioExistente = new Usuario { Matricula = "123" };

        // Configura o mock para simular que já encontrou um usuário com a mesma matrícula
        _mockUsuarioRepo.Setup(r => r.ObterPorMatriculaAsync(criarUsuarioDto.Matricula))
                        .ReturnsAsync(usuarioExistente);

        // Act & Assert
        // Verifica se o método lança uma exceção, como esperado
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(criarUsuarioDto));
        Assert.Equal("Já existe um usuário cadastrado com esta matrícula.", exception.Message);
    }

    [Fact]
    public async Task AutenticarAsync_ComSenhaInvalida_DeveLancarExcecao()
    {
        // Arrange
        var loginDto = new LoginDto { Matricula = "123", Senha = "senha_errada" };
        var usuarioExistente = new Usuario { Matricula = "123", Senha = "hash_da_senha_correta" };

        // Configura o mock para encontrar o usuário
        _mockUsuarioRepo.Setup(r => r.ObterPorMatriculaAsync(loginDto.Matricula))
                        .ReturnsAsync(usuarioExistente);

        // Configura o mock do hasher para retornar 'false' (senha não confere)
        _mockPasswordHasher.Setup(h => h.VerifyPassword(loginDto.Senha, usuarioExistente.Senha))
                           .Returns(false);

        // Act & Assert
        // Verifica se o método lança uma exceção
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.AutenticarAsync(loginDto));
        Assert.Equal("Matrícula ou senha inválida.", exception.Message);
    }
}