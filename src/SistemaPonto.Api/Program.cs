// Arquivo: src/SistemaPonto.Api/Program.cs

using Microsoft.EntityFrameworkCore;
using SistemaPonto.Infrastructure.Persistence;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Infrastructure.Repositories;
using SistemaPonto.Application.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SistemaPonto.Infrastructure.Auth;
using Microsoft.OpenApi.Models;
using SistemaPonto.Domain.Entities; // <--- Os Enums estão aqui dentro

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuração de CORS (Liberado para Localhost) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "_myAllowSpecificOrigins",
                      policy  =>
                      {
                          policy.AllowAnyOrigin() // Libera geral para facilitar a demo local
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// --- 2. Banco de Dados ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- 3. Injeção de Dependência ---
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IRegistroPontoRepository, RegistroPontoRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IRegistroPontoService, RegistroPontoService>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddSingleton<IPasswordHasherService, PasswordHasherService>();

// --- 4. Autenticação ---
var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtSettings:Secret"]!);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// --- 5. PREPARAÇÃO DO AMBIENTE LOCAL (CRIAÇÃO AUTOMÁTICA) ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        
        // FORÇA A CRIAÇÃO DO BANCO LOCALMENTE
        // EnsureCreated é perfeito para demos locais: se não tem tabela, ele cria tudo agora.
        if (dbContext.Database.IsRelational())
        {
             dbContext.Database.EnsureCreated();
        }

        // SEED: Cria o Admin se estiver vazio
        if (!dbContext.Usuarios.Any())
        {
            var passwordHasher = services.GetRequiredService<IPasswordHasherService>();
            
            var adminUser = new Usuario
            {
                NomeCompleto = "Administrador Local",
                Matricula = "admin",
                Senha = passwordHasher.HashPassword("admin123"),
                TipoUsuario = TipoUsuarioEnum.ADMIN, // Agora ele vai encontrar
                Status = StatusUsuarioEnum.ATIVO,    // Agora ele vai encontrar
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            dbContext.Usuarios.Add(adminUser);
            dbContext.SaveChanges();
            Console.WriteLine("✅✅✅ ADMIN LOCAL CRIADO: admin / admin123");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro no Setup Local: {ex.Message}");
    }
}

// Swagger sempre ativo para facilitar sua apresentação
app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();//
app.UseCors("_myAllowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Necessário para os testes de integração
public partial class Program { }