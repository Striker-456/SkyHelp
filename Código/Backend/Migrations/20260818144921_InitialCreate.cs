using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EstadosTickets",
                columns: table => new
                {
                    IdEstado = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreEstado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstadosTickets", x => x.IdEstado);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    IDRol = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreRol = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.IDRol);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdRol = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreUsuarios = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NombreCompleto = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Contrasena = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EstadoCuenta = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Roles_IdRol",
                        column: x => x.IdRol,
                        principalTable: "Roles",
                        principalColumn: "IDRol",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Articulos",
                columns: table => new
                {
                    IdArticulo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Contenido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaPublicacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalVistas = table.Column<int>(type: "int", nullable: false),
                    CalificacionPromedio = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articulos", x => x.IdArticulo);
                    table.ForeignKey(
                        name: "FK_Articulos_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auditoria",
                columns: table => new
                {
                    IDLog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IDUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoEvento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TablaAfectada = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IDRegistro = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FechaEvento = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auditoria", x => x.IDLog);
                    table.ForeignKey(
                        name: "FK_Auditoria_Usuarios_IDUsuario",
                        column: x => x.IDUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Domiciliarios",
                columns: table => new
                {
                    IdDomiciliario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreCompleto = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PlacaVehiculo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EstadoActividad = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IDUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Domiciliarios", x => x.IdDomiciliario);
                    table.ForeignKey(
                        name: "FK_Domiciliarios_Usuarios_IDUsuario",
                        column: x => x.IDUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Estadisticas",
                columns: table => new
                {
                    IdEstadistica = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Periodo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TipoGrafico = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Datos = table.Column<string>(type: "ntext", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExportadoExcel = table.Column<bool>(type: "bit", nullable: false),
                    ExportadoPDF = table.Column<bool>(type: "bit", nullable: false),
                    FechaGeneracion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estadisticas", x => x.IdEstadistica);
                    table.ForeignKey(
                        name: "FK_Estadisticas_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reportes",
                columns: table => new
                {
                    IdReporte = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TipoReporte = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FechaGeneracion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdOrigen = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrigenTabla = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reportes", x => x.IdReporte);
                    table.ForeignKey(
                        name: "FK_Reportes_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tecnicos",
                columns: table => new
                {
                    IdTecnico = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tecnicos", x => x.IdTecnico);
                    table.ForeignKey(
                        name: "FK_Tecnicos_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pedidos",
                columns: table => new
                {
                    IdPedido = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdDomiciliario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FechaPedido = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DireccionEntrega = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    EstadoPedido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pedidos", x => x.IdPedido);
                    table.ForeignKey(
                        name: "FK_Pedidos_Domiciliarios_IdDomiciliario",
                        column: x => x.IdDomiciliario,
                        principalTable: "Domiciliarios",
                        principalColumn: "IdDomiciliario",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pedidos_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExportacionesEstadisticas",
                columns: table => new
                {
                    IdExportado = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdEstadistica = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExportadoPor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FechaExportacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Formato = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExportacionesEstadisticas", x => x.IdExportado);
                    table.ForeignKey(
                        name: "FK_ExportacionesEstadisticas_Estadisticas_IdEstadistica",
                        column: x => x.IdEstadistica,
                        principalTable: "Estadisticas",
                        principalColumn: "IdEstadistica",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    IdTicket = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NumeroTicket = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prioridad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdEstado = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdDomiciliario = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdTecnico = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.IdTicket);
                    table.ForeignKey(
                        name: "FK_Tickets_Domiciliarios_IdDomiciliario",
                        column: x => x.IdDomiciliario,
                        principalTable: "Domiciliarios",
                        principalColumn: "IdDomiciliario");
                    table.ForeignKey(
                        name: "FK_Tickets_EstadosTickets_IdEstado",
                        column: x => x.IdEstado,
                        principalTable: "EstadosTickets",
                        principalColumn: "IdEstado",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tickets_Tecnicos_IdTecnico",
                        column: x => x.IdTecnico,
                        principalTable: "Tecnicos",
                        principalColumn: "IdTecnico");
                    table.ForeignKey(
                        name: "FK_Tickets_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Evaluaciones",
                columns: table => new
                {
                    IdEvaluacion = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdTicket = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Calificacion = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FechaEvaluacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evaluaciones", x => x.IdEvaluacion);
                    table.ForeignKey(
                        name: "FK_Evaluaciones_Tickets_IdTicket",
                        column: x => x.IdTicket,
                        principalTable: "Tickets",
                        principalColumn: "IdTicket",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Evaluaciones_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notificaciones",
                columns: table => new
                {
                    IdNotificacion = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Contenido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaEnvio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MedioEnvio = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Leido = table.Column<bool>(type: "bit", nullable: false),
                    IDTicket = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificaciones", x => x.IdNotificacion);
                    table.ForeignKey(
                        name: "FK_Notificaciones_Tickets_IDTicket",
                        column: x => x.IDTicket,
                        principalTable: "Tickets",
                        principalColumn: "IdTicket",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notificaciones_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Articulos_IdUsuario",
                table: "Articulos",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Auditoria_IDUsuario",
                table: "Auditoria",
                column: "IDUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Domiciliarios_IDUsuario",
                table: "Domiciliarios",
                column: "IDUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Estadisticas_IdUsuario",
                table: "Estadisticas",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluaciones_IdTicket",
                table: "Evaluaciones",
                column: "IdTicket");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluaciones_IdUsuario",
                table: "Evaluaciones",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_ExportacionesEstadisticas_IdEstadistica",
                table: "ExportacionesEstadisticas",
                column: "IdEstadistica");

            migrationBuilder.CreateIndex(
                name: "IX_Notificaciones_IDTicket",
                table: "Notificaciones",
                column: "IDTicket");

            migrationBuilder.CreateIndex(
                name: "IX_Notificaciones_IdUsuario",
                table: "Notificaciones",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_IdDomiciliario",
                table: "Pedidos",
                column: "IdDomiciliario");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_IdUsuario",
                table: "Pedidos",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Reportes_IdUsuario",
                table: "Reportes",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Tecnicos_IdUsuario",
                table: "Tecnicos",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_IdDomiciliario",
                table: "Tickets",
                column: "IdDomiciliario");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_IdEstado",
                table: "Tickets",
                column: "IdEstado");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_IdTecnico",
                table: "Tickets",
                column: "IdTecnico");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_IdUsuario",
                table: "Tickets",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_IdRol",
                table: "Usuarios",
                column: "IdRol");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Articulos");

            migrationBuilder.DropTable(
                name: "Auditoria");

            migrationBuilder.DropTable(
                name: "Evaluaciones");

            migrationBuilder.DropTable(
                name: "ExportacionesEstadisticas");

            migrationBuilder.DropTable(
                name: "Notificaciones");

            migrationBuilder.DropTable(
                name: "Pedidos");

            migrationBuilder.DropTable(
                name: "Reportes");

            migrationBuilder.DropTable(
                name: "Estadisticas");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Domiciliarios");

            migrationBuilder.DropTable(
                name: "EstadosTickets");

            migrationBuilder.DropTable(
                name: "Tecnicos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
