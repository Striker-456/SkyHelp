using Microservicios;
using Microsoft.EntityFrameworkCore;

namespace SkyHelp.Context
{
    public class SkyHelpContext : DbContext
    {
        public SkyHelpContext(DbContextOptions<SkyHelpContext> options) : base(options)
        {
        }

        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Articulos> Articulos { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de la entidad Usuarios

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.IDUsuarios);
                entity.Property(e => e.NombreUsuarios).IsRequired().HasMaxLength(50);
                entity.Property(e => e.NombreCompleto).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Correo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Contraseña).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EstadoCuenta).IsRequired().HasMaxLength(50);
                entity.ToTable("Usuarios");
            });
            // Configuración de la entidad Roles
            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.IDRol);
                entity.Property(e => e.NombreRol).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Descripcion).HasMaxLength(200);
                entity.ToTable("Roles");
            });
            // Configuración de la entidad Articulos
            modelBuilder.Entity<Articulos>(entity =>
            {
                entity.HasKey(e => e.IDArticulo);
                entity.Property(e => e.Titulo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Categoria).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Contenido).IsRequired();
                entity.Property(e => e.FechaPublicacion).IsRequired();
                entity.Property(e => e.TotalVistas).IsRequired();
                entity.Property(e => e.CalificacionPromedio).IsRequired();
                entity.ToTable("Articulos");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
