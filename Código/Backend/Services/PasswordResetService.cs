using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Security;
using SkyHelp.Services.Interfaces;

namespace SkyHelp.Services
{
    /// <summary>
    /// Implementación del flujo de restablecimiento de contraseña con enlace temporal.
    ///
    /// Decisiones de seguridad:
    /// - El token se genera con <see cref="RandomNumberGenerator"/> (256 bits) y se codifica en Base64Url.
    /// - Solo se almacena su hash SHA-256: el token en claro vive únicamente en el enlace del correo.
    /// - Expiración corta (configurable, 30 min por defecto).
    /// - Un solo uso: al aplicarse se marca FechaUso y no vuelve a ser válido.
    /// - Al generar un token nuevo se invalidan los anteriores del mismo usuario.
    /// - La búsqueda del usuario es por correo; el correo se normaliza (trim + minúsculas).
    /// </summary>
    public class PasswordResetService : IPasswordResetService
    {
        private readonly SkyHelpContext _context;
        private readonly IEmailService _emailService;
        private readonly EmailOptions _emailOptions;
        private readonly ILogger<PasswordResetService> _logger;

        public PasswordResetService(
            SkyHelpContext context,
            IEmailService emailService,
            IOptions<EmailOptions> emailOptions,
            ILogger<PasswordResetService> logger)
        {
            _context = context;
            _emailService = emailService;
            _emailOptions = emailOptions.Value;
            _logger = logger;
        }

        private static readonly TimeSpan Vigencia = TimeSpan.FromMinutes(30);

        public async Task<(string Enlace, DateTime Expiracion)?> GenerarTokenAsync(
            string correo,
            string? ipSolicitante,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(correo))
                return null;

            var correoNormalizado = correo.Trim().ToLowerInvariant();
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo.ToLower() == correoNormalizado, cancellationToken);

            if (usuario == null)
            {
                _logger.LogInformation("Solicitud de restablecimiento para un correo no registrado.");
                return null;
            }

            // Una cuenta inactiva no puede restablecer la contraseña (coherente con el login).
            if (!string.Equals(usuario.EstadoCuenta, "Activo", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Solicitud de restablecimiento para una cuenta inactiva {IdUsuario}.", usuario.IdUsuario);
                return null;
            }

            // Invalidar tokens previos no usados: solo el último enlace generado es válido.
            var anteriores = await _context.PasswordResetTokens
                .Where(t => t.IdUsuario == usuario.IdUsuario && t.FechaUso == null)
                .ToListAsync(cancellationToken);
            if (anteriores.Count > 0)
                _context.PasswordResetTokens.RemoveRange(anteriores);

            // Token en claro: 32 bytes aleatorios (256 bits) en Base64Url (seguro para URL).
            var tokenEnClaro = Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            var expiracion = DateTime.UtcNow.Add(Vigencia);

            _context.PasswordResetTokens.Add(new PasswordResetToken
            {
                IdUsuario = usuario.IdUsuario,
                TokenHash = Hashear(tokenEnClaro),
                FechaCreacion = DateTime.UtcNow,
                FechaExpiracion = expiracion,
                SolicitadoDesdeIp = ipSolicitante
            });

            await _context.SaveChangesAsync(cancellationToken);

            var baseUrl = _emailOptions.UrlBaseFrontend?.TrimEnd('/') ?? string.Empty;
            var enlace = $"{baseUrl}/reset-password?token={Uri.EscapeDataString(tokenEnClaro)}";

            await _emailService.EnviarCorreoRestablecimientoAsync(usuario, enlace, expiracion, cancellationToken);

            return (enlace, expiracion);
        }

        public async Task<string?> RestablecerContrasenaAsync(
            string tokenEnClaro,
            string nuevaContrasena,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(tokenEnClaro))
                return "El token es obligatorio.";

            var errorClave = PasswordPolicy.Validar(nuevaContrasena);
            if (errorClave != null)
                return errorClave;

            var hash = Hashear(tokenEnClaro);

            var token = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.TokenHash == hash, cancellationToken);

            // Mensaje único para token inexistente, ya usado o expirado: no se filtra información.
            const string mensajeInvalido = "El enlace de restablecimiento no es válido o ha expirado. Solicita uno nuevo.";

            if (token == null || token.FechaUso != null || token.FechaExpiracion <= DateTime.UtcNow)
                return mensajeInvalido;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == token.IdUsuario, cancellationToken);
            if (usuario == null)
                return mensajeInvalido;

            if (!string.Equals(usuario.EstadoCuenta, "Activo", StringComparison.OrdinalIgnoreCase))
                return mensajeInvalido;

            usuario.Contrasena = PasswordHasher.HashPassword(nuevaContrasena);
            token.FechaUso = DateTime.UtcNow;

            // Higiene: eliminar cualquier otro token pendiente del mismo usuario.
            var otros = await _context.PasswordResetTokens
                .Where(t => t.IdUsuario == usuario.IdUsuario && t.IdToken != token.IdToken && t.FechaUso == null)
                .ToListAsync(cancellationToken);
            if (otros.Count > 0)
                _context.PasswordResetTokens.RemoveRange(otros);

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Contraseña restablecida correctamente para el usuario {IdUsuario}.", usuario.IdUsuario);
            return null;
        }

        private static string Hashear(string valor)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(valor));
            return Convert.ToHexString(bytes);
        }

        private static string Base64UrlEncode(byte[] bytes) =>
            Convert.ToBase64String(bytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');
    }
}