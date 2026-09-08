using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketLinkAndDeliveryDateToPedidos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaEntrega",
                table: "Pedidos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IdTicket",
                table: "Pedidos",
                type: "uniqueidentifier",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaEntrega",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "IdTicket",
                table: "Pedidos");
        }
    }
}
