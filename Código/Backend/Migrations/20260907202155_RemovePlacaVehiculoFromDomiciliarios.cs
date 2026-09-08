using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class RemovePlacaVehiculoFromDomiciliarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlacaVehiculo",
                table: "Domiciliarios");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlacaVehiculo",
                table: "Domiciliarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
