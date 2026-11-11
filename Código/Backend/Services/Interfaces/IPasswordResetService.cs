namespace SkyHelp.Services.Interfaces
{
    /// <summary>
    /// Gestiona el ciclo de vida de los tokens de restablecimiento de contraseña:
    /// generación, validación y consumo. No conoce el mecanismo de envío del correo.
    /// </summary>
    public interface IPasswordResetService
    {
        /// <summary>
        /// Genera un token de un solo uso para el correo indicado y devuelve el enlace
        /// completo que debe enviarse al usuario, o <c>null</c> si el correo no existe.
        /// La respuesta al cliente debe ser idéntica en ambos casos (no enumeración de cuentas).
        /// </summary>
        Task<(string Enlace, DateTime Expiracion)?> GenerarTokenAsync(string correo, string? ipSolicitante, CancellationToken cancellationToken = default);

        /// <summary>
        /// Valida el token y, si es correcto, actualiza la contraseña del usuario y lo consume.
        /// Devuelve <c>null</c> si tuvo éxito o el mensaje de error si falló.
        /// </summary>
        Task<string?> RestablecerContrasenaAsync(string tokenEnClaro, string nuevaContrasena, CancellationToken cancellationToken = default);
    }
}