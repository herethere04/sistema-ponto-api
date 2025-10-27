using System; // Adicionado para DateTime
using System.Collections.Generic; // Adicionado para IEnumerable
using System.Linq; // Adicionado para Select
using System.Threading.Tasks; // Adicionado para Task
using SistemaPonto.Application.DTOs;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasherService _passwordHasherService;

    public UsuarioService(IUsuarioRepository usuarioRepository, ITokenService tokenService, IPasswordHasherService passwordHasherService)
    {
        _usuarioRepository = usuarioRepository;
        _tokenService = tokenService;
        _passwordHasherService = passwordHasherService;
    }

    public async Task<string> AutenticarAsync(LoginDto loginDto)
    {
        var usuario = await _usuarioRepository.ObterPorMatriculaAsync(loginDto.Matricula);

        // Verificação de status adicionada aqui!
        if (usuario == null || usuario.Status != StatusUsuarioEnum.ATIVO || !_passwordHasherService.VerifyPassword(loginDto.Senha, usuario.Senha))
        {
            throw new Exception("Matrícula ou senha inválida.");
        }

        var token = _tokenService.GenerateToken(usuario);
        return token;
    }

    public async Task<UsuarioDto> CriarAsync(CriarUsuarioDto criarUsuarioDto)
    {
        var usuarioExistente = await _usuarioRepository.ObterPorMatriculaAsync(criarUsuarioDto.Matricula);
        if (usuarioExistente != null)
        {
            throw new Exception("Já existe um usuário cadastrado com esta matrícula.");
        }

        var passwordHash = _passwordHasherService.HashPassword(criarUsuarioDto.Senha);

        var novoUsuario = new Usuario
        {
            NomeCompleto = criarUsuarioDto.NomeCompleto,
            Matricula = criarUsuarioDto.Matricula,
            Senha = passwordHash,
            TipoUsuario = TipoUsuarioEnum.FUNCIONARIO,
            Status = StatusUsuarioEnum.ATIVO,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var usuarioSalvo = await _usuarioRepository.AdicionarAsync(novoUsuario);

        var usuarioDto = new UsuarioDto
        {
            Id = usuarioSalvo.Id,
            NomeCompleto = usuarioSalvo.NomeCompleto,
            Matricula = usuarioSalvo.Matricula,
            TipoUsuario = usuarioSalvo.TipoUsuario.ToString(),
            Status = usuarioSalvo.Status.ToString()
        };

        return usuarioDto;
    }

    public async Task<IEnumerable<UsuarioDto>> ObterTodosAsync()
    {
        var usuarios = await _usuarioRepository.ObterTodosAsync();

        return usuarios.Select(u => new UsuarioDto
        {
            Id = u.Id,
            NomeCompleto = u.NomeCompleto,
            Matricula = u.Matricula,
            TipoUsuario = u.TipoUsuario.ToString(),
            Status = u.Status.ToString()
        });
    }

    // --- GARANTA QUE ESTE MÉTODO ESTEJA AQUI ---
    public async Task<UsuarioDto> DesativarAsync(int id)
    {
        // Log para depuração
        Console.WriteLine($"[Service] Buscando usuário com ID: {id}");

        var usuario = await _usuarioRepository.ObterPorIdAsync(id);
        if (usuario == null)
        {
            // Log para depuração
            Console.WriteLine($"[Service] Usuário com ID: {id} NÃO encontrado no repositório.");
            throw new Exception("Usuário não encontrado.");
        }

        // Log para depuração
        Console.WriteLine($"[Service] Usuário com ID: {id} encontrado. Nome: {usuario.NomeCompleto}");


        usuario.Status = StatusUsuarioEnum.INATIVO;
        usuario.UpdatedAt = DateTime.UtcNow;

        await _usuarioRepository.AtualizarAsync(usuario);

        return new UsuarioDto
        {
            Id = usuario.Id,
            NomeCompleto = usuario.NomeCompleto,
            Matricula = usuario.Matricula,
            TipoUsuario = usuario.TipoUsuario.ToString(),
            Status = usuario.Status.ToString()
        };
    }
    // ------------------------------------------
}