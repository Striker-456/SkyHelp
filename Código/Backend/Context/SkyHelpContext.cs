using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp;
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
        public DbSet<Domiciliarios> Domiciliarios { get; set; }
        public DbSet<Reportes> Reportes { get; set; }
        public DbSet<Notificaciones> Notificaciones { get; set; }
        public DbSet<Pedidos> Pedidos { get; set; }
        public DbSet<Estadisticas> Estadisticas { get; set; }
        public DbSet<ExportacionesEstadisticas> ExportacionesEstadisticas { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de la entidad Usuarios

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.IdUsuarios);
                entity.Property(e => e.IdRol).IsRequired();
                entity.Property(e => e.NombreUsuarios).IsRequired().HasMaxLength(50);
                entity.Property(e => e.NombreCompleto).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Correo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Contrasena).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EstadoCuenta).IsRequired().HasMaxLength(50);
                entity.HasOne(e => e.Rol)
                      .WithMany(t => t.Usuario)
                      .HasForeignKey(e => e.IdRol);
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
                entity.Property(e => e.Contenido).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Fecha_Publicacion).IsRequired();
                entity.Property(e => e.TotalVistas).IsRequired();
                entity.Property(e => e.CalificacionPromedio).HasColumnType("decimal(18, 0)").IsRequired();
                entity.Property(e => e.IDUsuario).IsRequired();
                // Relación con Usuarios
                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.Articulos)
                    .HasForeignKey(e => e.IDUsuario);
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
                entity.HasOne(e => e.Usuario)
                      .WithMany(t => t.Auditorias)
                      .HasForeignKey(e => e.IDUsuario);
                entity.ToTable("Auditoria");
            });

            // Configuración de la entidad Domiciliarios
            modelBuilder.Entity<Domiciliarios>(entity =>
            {
                entity.HasKey(e => e.IdDomiciliario);
                entity.Property(e => e.NombreCompleto).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Telefono).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EstadoActividad).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PlacaVehiculo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.IDUsuario).IsRequired();
                entity.HasOne(e => e.Usuario)
                .WithMany(t => t.Domiciliarios)
                .HasForeignKey(e => e.IDUsuario);
                entity.ToTable("Domiciliarios");
            });

            //Configuracion de la entidada Reportes 
            modelBuilder.Entity<Reportes>(entity =>
            {
                entity.HasKey(e => e.IdReporte);
                entity.Property(e => e.TipoReporte).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descripcion).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FechaGeneracion).IsRequired();
                entity.Property(e => e.IdUsuario).IsRequired();
                entity.Property(e => e.IdOrigen).IsRequired();
                entity.Property(e => e.OrigenTabla).IsRequired().HasMaxLength(100);
                entity.HasOne(e => e.Usuario)
                      .WithMany(t => t.Reportes)
                      .HasForeignKey(e => e.IdUsuario);
                entity.ToTable("Reportes");
            });
            //Configuracion de la entidad Notificaciones
            modelBuilder.Entity<Notificaciones>(entity =>
             {
                 entity.HasKey(e => e.IDNotificacion);
                 entity.Property(e => e.IDUsuario).IsRequired();
                 entity.Property(e => e.Contenido).IsRequired().HasMaxLength(50);
                 entity.Property(e => e.FechaEnvio).IsRequired();
                 entity.Property(e => e.MedioEnvio).IsRequired().HasMaxLength(50);
                 entity.Property(e => e.IDTicket).IsRequired();
                 entity.HasOne(e => e.Usuario)
                       .WithMany()
                       .HasForeignKey(e => e.IDUsuario);
                 entity.HasOne(e => e.Ticket)
                       .WithMany()
                       .HasForeignKey(e => e.IDTicket);
                 entity.ToTable("Notificaciones");
             });

            // Configuración de la entidad Pedidos
            modelBuilder.Entity<Pedidos>(entity =>
            {
                entity.HasKey(e => e.IdPedido);
                entity.Property(e => e.FechaPedido).IsRequired();
                entity.Property(e => e.EstadoPedido).IsRequired().HasMaxLength(50);
                entity.Property(e => e.DireccionEntrega).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Observaciones).HasMaxLength(500);
                entity.Property(e => e.IdUsuario).IsRequired();
                entity.Property(e => e.IdDomiciliario).IsRequired();
                entity.HasOne(e => e.Usuario)
                      .WithMany(t => t.Pedidos)
                      .HasForeignKey(e => e.IdUsuario);
                entity.HasOne(e => e.Domiciliario)
                      .WithMany(t => t.Pedidos)
                      .HasForeignKey(e => e.IdDomiciliario);
                entity.ToTable("Pedidos");
            });

            // Configuración de la entidad Estadisticas
            modelBuilder.Entity<Estadisticas>(entity =>
            {
                entity.ToTable("Estadisticas");
                entity.HasKey(e => e.IDEstadisticas);
                entity.Property(e => e.IDEstadisticas).HasColumnName("ID_Estadisticas");
                entity.Property(e => e.Periodo).HasColumnName("Periodo").HasMaxLength(50).IsRequired();
                entity.Property(e => e.FechaInicio).HasColumnName("Fecha_Inicio").IsRequired();
                entity.Property(e => e.FechaFin).HasColumnName("Fecha_Fin").IsRequired();
                entity.Property(e => e.TipoGrafico).HasColumnName("Tipo_Grafico").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Datos).HasColumnName("Datos").HasColumnType("ntext").IsRequired();
                entity.Property(e => e.IDUsuario).HasColumnName("IDUsuario").IsRequired();
                entity.Property(e => e.ExportadoExcel).HasColumnName("Exportado_Excel").IsRequired();
                entity.Property(e => e.ExportadoPDF).HasColumnName("Exportado_PDF").IsRequired();
                entity.Property(e => e.FechaGeneracion).HasColumnName("Fecha_Generacion").IsRequired();
                // RELACIÓN: Estadisticas -> Usuarios
                entity.HasOne(e => e.Usuario)
                      .WithMany(u => u.Estadisticas)
                      .HasForeignKey(e => e.IDUsuario);
            });

            // Configuración de la entidad ExportacionesEstadisticas
            modelBuilder.Entity<ExportacionesEstadisticas>(entity =>
            {
                entity.ToTable("ExportacionesEstadisticas");
                entity.HasKey(e => e.IDExportado);
                entity.Property(e => e.IDExportado).HasColumnName("ID_Exportado");
                entity.Property(e => e.IDEstadisticas).HasColumnName("ID_Estadisticas").IsRequired();
                entity.Property(e => e.ExportadoPor).HasColumnName("Exportado_Por").HasMaxLength(100).IsRequired();
                entity.Property(e => e.FechaExportacion).HasColumnName("Fecha_Exportacion").IsRequired();
                entity.Property(e => e.Formato).HasColumnName("Formato").HasMaxLength(50).IsRequired();
                // RELACIÓN: ExportacionesEstadisticas -> Estadisticas
                entity.HasOne(e => e.Estadisticas)
                      .WithMany()
                      .HasForeignKey(e => e.IDEstadisticas);
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
