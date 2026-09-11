using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class AddProgresoServicioTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FallaEncontrada",
                table: "Tickets",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Observaciones",
                table: "Tickets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PruebasRealizadas",
                table: "Tickets",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Recomendaciones",
                table: "Tickets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProgresoTickets",
                columns: table => new
                {
                    IdProgreso = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdTicket = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Porcentaje = table.Column<int>(type: "int", nullable: false),
                    Etapa = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdTecnico = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgresoTickets", x => x.IdProgreso);
                    table.ForeignKey(
                        name: "FK_ProgresoTickets_Tecnicos_IdTecnico",
                        column: x => x.IdTecnico,
                        principalTable: "Tecnicos",
                        principalColumn: "IdTecnico");
                    table.ForeignKey(
                        name: "FK_ProgresoTickets_Tickets_IdTicket",
                        column: x => x.IdTicket,
                        principalTable: "Tickets",
                        principalColumn: "IdTicket",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProgresoTickets_IdTecnico",
                table: "ProgresoTickets",
                column: "IdTecnico");

            migrationBuilder.CreateIndex(
                name: "IX_ProgresoTickets_IdTicket",
                table: "ProgresoTickets",
                column: "IdTicket");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProgresoTickets");

            migrationBuilder.DropColumn(
                name: "FallaEncontrada",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Observaciones",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "PruebasRealizadas",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Recomendaciones",
                table: "Tickets");
        }
    }
}
