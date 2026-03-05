using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaPonto.Application.Interfaces;

namespace SistemaPonto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PontoController : ControllerBase
{
    private readonly IRegistroPontoService _registroPontoService;

    public PontoController(IRegistroPontoService registroPontoService)
    {
        _registroPontoService = registroPontoService;
    }

    [HttpPost("registrar")]
    [Authorize(Roles = "FUNCIONARIO")] // <-- Protege o endpoint, só permite acesso a usuários com o perfil "FUNCIONARIO"
    public async Task<IActionResult> RegistrarPonto()
    {
        try
        {
            // Pega o ID do usuário a partir do token JWT que ele enviou na requisição.
            var usuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(usuarioIdClaim))
            {
                return Unauthorized("Token inválido: ID do usuário não encontrado.");
            }

            var usuarioId = int.Parse(usuarioIdClaim);

            // Chama o serviço com o ID do usuário autenticado.
            var registroPontoDto = await _registroPontoService.RegistrarPontoAsync(usuarioId);
            return Ok(registroPontoDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("historico")]
    [Authorize(Roles = "FUNCIONARIO")] // <-- Protege o endpoint
    public async Task<IActionResult> ObterHistorico()
    {
        try
        {
            var usuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(usuarioIdClaim))
            {
                return Unauthorized("Token inválido: ID do usuário não encontrado.");
            }

            var usuarioId = int.Parse(usuarioIdClaim);
            var historico = await _registroPontoService.ObterHistoricoUsuarioAsync(usuarioId);
            return Ok(historico);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}