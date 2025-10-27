using Microsoft.AspNetCore.Mvc;
using SistemaPonto.Application.DTOs;
using SistemaPonto.Application.Interfaces;

namespace SistemaPonto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public AuthController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var token = await _usuarioService.AutenticarAsync(loginDto);
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message }); // Retorna 401 Unauthorized para login inválido
        }
    }
}