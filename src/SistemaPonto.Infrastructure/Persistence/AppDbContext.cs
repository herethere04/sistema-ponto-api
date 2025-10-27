// Arquivo: src/SistemaPonto.Infrastructure/Persistence/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<RegistroPonto> RegistrosPonto { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Futuramente, podemos adicionar configurações mais detalhadas aqui.
        base.OnModelCreating(modelBuilder);
    }
}