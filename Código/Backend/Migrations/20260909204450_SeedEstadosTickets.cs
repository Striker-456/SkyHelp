using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class SeedEstadosTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "EstadosTickets",
                columns: new[] { "IdEstado", "Descripcion", "NombreEstado" },
                values: new object[,]
                {
                    { new Guid("66666666-6666-6666-6666-666666666666"), "Ticket recién creado, aún sin atender.", "Abierto" },
                    { new Guid("77777777-7777-7777-7777-777777777777"), "Ticket en espera de diagnóstico o de una acción posterior.", "Pendiente" },
                    { new Guid("88888888-8888-8888-8888-888888888888"), "El pedido asociado al ticket se está preparando para su entrega.", "En preparacion" },
                    { new Guid("99999999-9999-9999-9999-999999999999"), "El domiciliario va en camino a entregar el pedido.", "En ruta" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "El ticket fue atendido y cerrado.", "Resuelto" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EstadosTickets",
                keyColumn: "IdEstado",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "EstadosTickets",
                keyColumn: "IdEstado",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "EstadosTickets",
                keyColumn: "IdEstado",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"));

            migrationBuilder.DeleteData(
                table: "EstadosTickets",
                keyColumn: "IdEstado",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));

            migrationBuilder.DeleteData(
                table: "EstadosTickets",
                keyColumn: "IdEstado",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));
        }
    }
}
