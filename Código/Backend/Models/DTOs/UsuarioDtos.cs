using System.ComponentModel.DataAnnotations;

namespace SkyHelp.Models.DTOs
{
    /// <summary>
    /// DTOs de entrada/salida del módulo de usuarios.
    /// Evitan la sobreasignación (mass assignment): el cliente nunca puede elegir
    /// IdRol en el registro público y la contraseña (ni su hash) jamás se devuelve en las respuestas.
    /// </summary>

    // Entrada: registro público. El rol "Usuario" y el estado "Activo" los asigna SIEMPRE el servidor.
    public record RegistroUsuarioRequest(
        [Required, StringLength(50)] string NombreUsuarios,
        [Required, StringLength(100)] string NombreCompleto,
        [Required, EmailAddress, StringLength(100)] string Correo,
        [Required, StringLength(72)] string Contrasena,
        [StringLength(20)] string? Telefono);

    // Entrada: alta de usuarios por un Administrador (puede elegir rol y estado).
    public record CrearUsuarioAdminRequest(
        [Required, StringLength(50)] string NombreUsuarios,
        [Required, StringLength(100)] string NombreCompleto,
        [Required, EmailAddress, StringLength(100)] string Correo,
        [Required, StringLength(72)] string Contrasena,
        [Required] Guid IdRol,
        [Required, StringLength(50)] string EstadoCuenta,
        [StringLength(20)] string? Telefono);

    // Entrada: edición administrativa de cualquier usuario.
    public record ActualizarUsuarioAdminRequest(
        [Required] Guid IdUsuario,
        [Required, StringLength(50)] string NombreUsuarios,
        [Required, StringLength(100)] string NombreCompleto,
        [Required, EmailAddress, StringLength(100)] string Correo,
        [Required] Guid IdRol,
        [Required, StringLength(50)] string EstadoCuenta,
        [StringLength(20)] string? Telefono,
        [StringLength(72)] string? Contrasena);

    // Entrada: el usuario solo edita su propio perfil. Sin IdRol, sin Contrasena, sin EstadoCuenta.
    public record ActualizarMiPerfilRequest(
        [Required, StringLength(50)] string NombreUsuarios,
        [Required, StringLength(100)] string NombreCompleto,
        [StringLength(20)] string? Telefono);

    public record CambiarContrasenaConVerificacionRequest(
        [Required] string ContrasenaActual,
        [Required, StringLength(72)] string NuevaContrasena);

    public record CambiarNombreRequest(
        [Required, StringLength(100)] string NuevoNombre,
        [Required] string Contrasena);

    public record CambiarCorreoRequest(
        [Required, EmailAddress, StringLength(100)] string NuevoCorreo,
        [Required] string Contrasena);

    public record LoginRequest(
        [Required, EmailAddress] string Correo,
        [Required] string Contrasena);

    // Entrada: solicitud del enlace temporal de restablecimiento.
    public record SolicitarRestablecimientoRequest(
        [Required, EmailAddress, StringLength(100)] string Correo);

    // Entrada: consumo del token del enlace y definición de la nueva contraseña.
    public record RestablecerContrasenaRequest(
        [Required] string Token,
        [Required, StringLength(72)] string NuevaContrasena);

    // Salida: proyección segura del usuario. NUNCA incluye la contraseña.
    public record UsuarioResponse(
        Guid IdUsuario,
        string NombreUsuarios,
        string NombreCompleto,
        string Correo,
        string EstadoCuenta,
        string? Telefono,
        Guid IdRol);

    // Salida: listado público de roles (solo id y nombre, sin descripción interna).
    public record RolResponse(Guid IdRol, string NombreRol);
}
