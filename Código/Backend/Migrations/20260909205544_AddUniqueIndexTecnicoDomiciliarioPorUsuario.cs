using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexTecnicoDomiciliarioPorUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tecnicos_IdUsuario",
                table: "Tecnicos");

            migrationBuilder.DropIndex(
                name: "IX_Domiciliarios_IDUsuario",
                table: "Domiciliarios");

            migrationBuilder.CreateIndex(
                name: "IX_Tecnicos_IdUsuario",
                table: "Tecnicos",
                column: "IdUsuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Domiciliarios_IDUsuario",
                table: "Domiciliarios",
                column: "IDUsuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tecnicos_IdUsuario",
                table: "Tecnicos");

            migrationBuilder.DropIndex(
                name: "IX_Domiciliarios_IDUsuario",
                table: "Domiciliarios");

            migrationBuilder.CreateIndex(
                name: "IX_Tecnicos_IdUsuario",
                table: "Tecnicos",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Domiciliarios_IDUsuario",
                table: "Domiciliarios",
                column: "IDUsuario");
        }
    }
}
