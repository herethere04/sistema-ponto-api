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

// --- ADICIONE ESTA LINHA PARA O NOME DA POLÍTICA DE CORS ---
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
// -----------------------------------------------------------

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          // Permite requisições dos endereços do Live Server
                          policy.WithOrigins("http://localhost:5500",
                                             "http://127.0.0.1:5500")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});


// Configuração do DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ... (Injeção de Dependência) ...
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IRegistroPontoRepository, RegistroPontoRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IRegistroPontoService, RegistroPontoService>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddSingleton<IPasswordHasherService, PasswordHasherService>();

// ... (Configuração de Autenticação) ...
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
// ... (Configuração do SwaggerGen) ...
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { /*...*/ });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { /*...*/ });
});

var app = builder.Build();

// Aplica as migrations automaticamente ao iniciar (em ambiente de desenvolvimento)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();