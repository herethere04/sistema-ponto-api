using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Http;
using SistemaPonto.Application.DTOs;
using SistemaPonto.Application.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;

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
    [EnableRateLimiting("LoginPolicy")] // Aplica Proteção contra Força Bruta
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var token = await _usuarioService.AutenticarAsync(loginDto);
            
            // Em vez de retornar no body, guardamos num cookie de segurança máxima
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Impede acesso do Javascript Frontend (Previne XSS)
                Secure = false,  // O ideal é true em produções com HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(8)
            };

            Response.Cookies.Append("jwt_token", token, cookieOptions);

            // Lê o token no backend para devolver o Role pro frontend saber redirecionar sem ter acesso ao token client-side
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role" || c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
            var role = roleClaim?.Value ?? "FUNCIONARIO";

            return Ok(new { message = "Autenticação bem-sucedida", role = role });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message }); // Retorna 401 Unauthorized para login inválido
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt_token");
        return Ok(new { message = "Logout realizado com sucesso" });
    }
}