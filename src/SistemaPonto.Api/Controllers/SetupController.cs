using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPonto.Infrastructure.Persistence;
using SistemaPonto.Domain.Entities; // Os Enums estão aqui dentro
using SistemaPonto.Application.Interfaces;

namespace SistemaPonto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasherService _passwordHasher;

    public SetupController(AppDbContext context, IPasswordHasherService passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    [HttpGet]
    public IActionResult SetupBanco()
    {
        try
        {
            // 1. Força a criação das tabelas
            _context.Database.EnsureCreated();
            
            // 2. Cria o Admin se não existir
            if (!_context.Usuarios.Any())
            {
                var admin = new Usuario
                {
                    NomeCompleto = "Admin de Emergencia",
                    Matricula = "admin",
                    Senha = _passwordHasher.HashPassword("admin123"),
                    TipoUsuario = TipoUsuarioEnum.ADMIN,
                    Status = StatusUsuarioEnum.ATIVO,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Usuarios.Add(admin);
                _context.SaveChanges();
                return Ok("SUCESSO! Banco criado e Admin gerado: admin / admin123");
            }

            return Ok("O Banco já existe e já tem usuários.");
        }
        catch (Exception ex)
        {
            return BadRequest($"ERRO CRÍTICO: {ex.Message} | {ex.InnerException?.Message}");
        }
    }
}