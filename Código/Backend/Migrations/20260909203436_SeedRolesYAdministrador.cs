using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SkyHelp.Migrations
{
    /// <inheritdoc />
    public partial class SeedRolesYAdministrador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "IDRol", "Descripcion", "NombreRol" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Administrador del sistema, con acceso total.", "Administrador" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Técnico encargado del diagnóstico y soporte de tickets.", "Tecnico" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Domiciliario encargado de la entrega de pedidos.", "Domiciliario" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Cliente que reporta tickets de soporte.", "Usuario" }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "IdUsuario", "Contrasena", "Correo", "EstadoCuenta", "IdRol", "NombreCompleto", "NombreUsuarios", "Telefono" },
                values: new object[] { new Guid("55555555-5555-5555-5555-555555555555"), "$2a$11$iZtHw38ztzeNAfWiTfmQ9e8aig.dwYG/xb60VDRNYgZI5UKIPIemO", "admin@skyhelp.com", "Activo", new Guid("11111111-1111-1111-1111-111111111111"), "Administrador SkyHelp", "admin", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "IDRol",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "IDRol",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "IDRol",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "IdUsuario",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "IDRol",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));
        }
    }
}
