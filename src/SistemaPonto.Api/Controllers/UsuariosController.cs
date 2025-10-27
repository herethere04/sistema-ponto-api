using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaPonto.Application.DTOs;
using SistemaPonto.Application.Interfaces;
using System; // Adicionado para Exception
using System.Threading.Tasks; // Adicionado para Task

namespace SistemaPonto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    // POST api/usuarios
    [HttpPost]
    public async Task<IActionResult> CriarUsuario([FromBody] CriarUsuarioDto criarUsuarioDto)
    {
        try
        {
            var usuarioDto = await _usuarioService.CriarAsync(criarUsuarioDto);
            // Retorna 200 OK com os dados do usuário criado
            return Ok(usuarioDto);
        }
        catch (Exception ex)
        {
            // Em caso de erro (ex: matrícula já existe), retorna 400 Bad Request com a mensagem de erro.
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/usuarios
    [HttpGet]
    [Authorize(Roles = "ADMIN")] // Garante que apenas Admins acessem
    public async Task<IActionResult> ObterTodos()
    {
        var usuarios = await _usuarioService.ObterTodosAsync();
        return Ok(usuarios);
    }

    // PATCH api/usuarios/{id}/desativar
    [HttpPatch("{id}/desativar")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DesativarUsuario(int id)
    {
        // --- Log para depuração ---
        Console.WriteLine($"[Controller] Recebido pedido para desativar ID: {id}");
        // ---------------------------
        try
        {
            var usuarioDto = await _usuarioService.DesativarAsync(id);
            return Ok(usuarioDto);
        }
        catch (Exception ex)
        {
            // Retorna 404 Not Found se o usuário não existir
            return NotFound(new { message = ex.Message });
        }
    }
}