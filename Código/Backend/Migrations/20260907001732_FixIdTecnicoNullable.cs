using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class FixIdTecnicoNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // La base de datos tenía IdTecnico como NOT NULL aunque el modelo (y el snapshot de
            // EF) siempre lo trataron como opcional (IsRequired(false)) — esto impedía crear
            // tickets sin técnico asignado todavía. Se corrige la columna real para que coincida
            // con lo que el modelo siempre esperó.
            migrationBuilder.AlterColumn<Guid>(
                name: "IdTecnico",
                table: "Tickets",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "IdTecnico",
                table: "Tickets",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.Empty,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
