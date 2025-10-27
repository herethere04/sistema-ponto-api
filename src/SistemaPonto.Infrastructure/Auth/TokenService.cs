using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Infrastructure.Auth;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Usuario usuario)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        // Lemos a chave secreta do appsettings.json
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]!);

        // Definimos as "claims" ou informações que queremos incluir no token
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Matricula), // Salva a matrícula do usuário
                new Claim(ClaimTypes.Role, usuario.TipoUsuario.ToString()) // Salva o tipo/perfil do usuário
                // Podemos adicionar mais claims aqui, como o Id do usuário
            }),
            Expires = DateTime.UtcNow.AddHours(8), // Define o tempo de expiração do token (8 horas)
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}