using SkyHelp.Models;

namespace SkyHelp.Services.Interfaces
{
    /// <summary>
    /// Abstracción del envío de correos. Permite sustituir SMTP por un proveedor
    /// transaccional (SendGrid, SES, etc.) o por una implementación de desarrollo.
    /// </summary>
    public interface IEmailService
    {
        /// <summary>Envía el correo con el enlace temporal de restablecimiento.</summary>
        Task EnviarCorreoRestablecimientoAsync(Usuarios usuario, string enlace, DateTime expiracion, CancellationToken cancellationToken = default);
    }
}