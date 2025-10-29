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
        public DbSet<UsuarioRol> UsuarioRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de la entidad Usuarios

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.IDUsuarios);
                entity.Property(e => e.NombreUsuarios).IsRequired().HasMaxLength(50);
                entity.Property(e => e.NombreCompleto).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Correo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Contrasena).IsRequired().HasMaxLength(50);
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

            // Configuración de la entidad UsuarioRol
            modelBuilder.Entity<UsuarioRol>(entity =>
            {
                entity.HasKey(e => e.IDUsuarioRol);
                entity.HasOne(e => e.Usuario)
                      .WithMany(u => u.UsuarioRoles)
                      .HasForeignKey(e => e.IDUsuario);
                entity.HasOne(e => e.Rol)
                      .WithMany(r => r.UsuariosRoles)
                      .HasForeignKey(e => e.IDRol);
                entity.ToTable("UsuarioRol");
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
