using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class AddDiagnosticoAndNumeroPedido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Diagnostico",
                table: "Tickets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDiagnostico",
                table: "Tickets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroPedido",
                table: "Pedidos",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_NumeroTicket",
                table: "Tickets",
                column: "NumeroTicket",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_NumeroPedido",
                table: "Pedidos",
                column: "NumeroPedido",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tickets_NumeroTicket",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Pedidos_NumeroPedido",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "Diagnostico",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "FechaDiagnostico",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "NumeroPedido",
                table: "Pedidos");
        }
    }
}
