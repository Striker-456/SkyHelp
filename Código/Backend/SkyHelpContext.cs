using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp.Models;

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
        public DbSet<Auditoria> Auditoria { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de la entidad Usuarios

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.IDUsuarios);
                entity.Property(e => e.IDRol).IsRequired();
                entity.Property(e => e.NombreUsuarios).IsRequired().HasMaxLength(50);
                entity.Property(e => e.NombreCompleto).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Correo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Contrasena).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EstadoCuenta).IsRequired().HasMaxLength(50);
                entity.HasOne(e => e.Rol)
                      .WithMany(t => t.Usuario)
                      .HasForeignKey(e => e.IDRol);
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
            // Configuración de la entidad Auditoria
            modelBuilder.Entity<Auditoria>(entity =>
            {
                entity.HasKey(e => e.IDLog);
                entity.Property(e => e.IDUsuario).IsRequired();
                entity.Property(e => e.TipoEvento).IsRequired().HasMaxLength(100);
                entity.Property(e => e.TablaAfectada).IsRequired();
                entity.Property(e => e.IDRegistro).IsRequired();
                entity.Property(e => e.Descripcion).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FechaEvento).IsRequired();
                entity.HasOne( e => e.Usuario)
                      .WithMany(t => t.Auditorias)
                      .HasForeignKey(e => e.IDUsuario);
                entity.ToTable("Auditoria");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
