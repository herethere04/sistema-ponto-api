// Arquivo: src/SistemaPonto.Api/Program.cs

using Microsoft.EntityFrameworkCore;
using SistemaPonto.Infrastructure.Persistence;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Infrastructure.Repositories;
using SistemaPonto.Application.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using SistemaPonto.Infrastructure.Auth;
using Microsoft.OpenApi.Models;
using SistemaPonto.Domain.Entities; // Importante para ver Usuario e Enums

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuração de CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials(); // Habilita o envio de Cookies gerados pelo backend
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

// --- 3.5. Proteção contra Brute Force (Rate Limiting) ---
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "LoginPolicy", options =>
    {
        options.PermitLimit = 5; // Máximo de 5 tentativas de login
        options.Window = TimeSpan.FromMinutes(1); // Dentro de uma janela de 1 minuto
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 0; // Se bater o limite, rejeita na hora as demais tentativas (status 429)
    });
});

// --- 4. Autenticação JWT ---
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
    options.Events = new JwtBearerEvents
    {
        // Intercepta a requisição e busca o token no Cookie HttpOnly ao invés do Header Bearer
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwt_token"))
            {
                context.Token = context.Request.Cookies["jwt_token"];
            }
            return Task.CompletedTask;
        }
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

// --- 5. BLOCO DE INICIALIZAÇÃO DO BANCO (MIGRAÇÃO + SEED ADMIN) ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        
        // A. Roda Migrations sempre (Produção e Dev), mas protege os testes em memória
        if (dbContext.Database.IsRelational())
        {
            dbContext.Database.Migrate();
        }

        // B. Cria Admin Padrão se não existir ninguém
        if (!dbContext.Usuarios.Any())
        {
            var passwordHasher = services.GetRequiredService<IPasswordHasherService>();
            
            var adminUser = new Usuario
            {
                NomeCompleto = "Administrador do Sistema",
                Matricula = "admin", 
                // CORREÇÃO: Propriedade correta é 'Senha'
                Senha = passwordHasher.HashPassword("admin123"), 
                // CORREÇÃO: Enum correto é 'TipoUsuarioEnum.ADMIN'
                TipoUsuario = TipoUsuarioEnum.ADMIN,
                // CORREÇÃO: Enum correto é 'StatusUsuarioEnum.ATIVO'
                Status = StatusUsuarioEnum.ATIVO,
                // CORREÇÃO: Propriedade correta é 'CreatedAt'
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            dbContext.Usuarios.Add(adminUser);
            dbContext.SaveChanges();
            Console.WriteLine("✅ Admin padrão criado: admin / admin123");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro ao inicializar o banco: {ex.Message}");
    }
}

// Swagger só em Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

// Middleware crucial para garantir que bloqueios de taxa rodem ANTES dos controllers processarem auth
app.UseRateLimiter(); 

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Necessário para os testes de integração
public partial class Program { }