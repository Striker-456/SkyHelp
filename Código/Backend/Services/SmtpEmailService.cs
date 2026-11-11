using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using SkyHelp.Models;
using SkyHelp.Services.Interfaces;

namespace SkyHelp.Services
{
    /// <summary>Configuración SMTP (sección "Email" de appsettings / variables SkyHelp__Email__*).</summary>
    public class EmailOptions
    {
        public const string SectionName = "Email";

        public string Host { get; set; } = string.Empty;
        public int Port { get; set; } = 587;
        public bool UseSsl { get; set; } = true;
        public string RemitenteCorreo { get; set; } = string.Empty;
        public string RemitenteNombre { get; set; } = "SkyHelp";
        public string? Usuario { get; set; }
        public string? Contrasena { get; set; }

        /// <summary>URL base del frontend para construir el enlace de restablecimiento.</summary>
        public string UrlBaseFrontend { get; set; } = string.Empty;
    }

    /// <summary>
    /// Envío de correos por SMTP usando <see cref="SmtpClient"/> (sin paquetes externos).
    /// </summary>
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailOptions _options;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IOptions<EmailOptions> options, ILogger<SmtpEmailService> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public async Task EnviarCorreoRestablecimientoAsync(
            Usuarios usuario,
            string enlace,
            DateTime expiracion,
            CancellationToken cancellationToken = default)
        {
            var asunto = "SkyHelp - Restablecimiento de contraseña";

            // Cuerpo HTML. El enlace se inserta escapado y el token viaja en la URL.
            var nombre = WebUtility.HtmlEncode(usuario.NombreCompleto ?? usuario.NombreUsuarios ?? "usuario");
            var enlaceSeguro = WebUtility.HtmlEncode(enlace);
            var expiraLocal = expiracion.ToLocalTime().ToString("dd/MM/yyyy HH:mm");

            var cuerpo = $@"
<div style=""font-family: Arial, Helvetica, sans-serif; color:#222; max-width:520px; margin:0 auto;"">
  <h2 style=""color:#0d6efd;"">Restablece tu contraseña</h2>
  <p>Hola {nombre},</p>
  <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>SkyHelp</strong>.</p>
  <p style=""text-align:center; margin:28px 0;"">
    <a href=""{enlaceSeguro}""
       style=""background:#0d6efd; color:#fff; text-decoration:none; padding:12px 24px;
              border-radius:6px; display:inline-block; font-weight:bold;"">
      Restablecer contraseña
    </a>
  </p>
  <p>Este enlace caduca el <strong>{expiraLocal}</strong> y solo puede usarse una vez.</p>
  <p>Si no solicitaste este cambio, ignora este mensaje: tu contraseña actual seguirá siendo válida.</p>
  <hr style=""border:none; border-top:1px solid #eee; margin:24px 0;"" />
  <p style=""font-size:12px; color:#888;"">
    Si el botón no funciona, copia y pega esta dirección en tu navegador:<br />
    <span style=""word-break:break-all;"">{enlaceSeguro}</span>
  </p>
</div>";

            if (string.IsNullOrWhiteSpace(_options.Host) || string.IsNullOrWhiteSpace(_options.RemitenteCorreo))
            {
                // Modo desarrollo: sin SMTP configurado no se puede enviar el correo,
                // pero se registra el enlace para poder probar el flujo localmente.
                _logger.LogWarning(
                    "SMTP no configurado (Email:Host / Email:RemitenteCorreo). Enlace de restablecimiento para {Correo}: {Enlace}",
                    usuario.Correo, enlace);
                return;
            }

            using var mensaje = new MailMessage
            {
                From = new MailAddress(_options.RemitenteCorreo, _options.RemitenteNombre),
                Subject = asunto,
                Body = cuerpo,
                IsBodyHtml = true
            };
            mensaje.To.Add(usuario.Correo);

            using var cliente = new SmtpClient(_options.Host, _options.Port)
            {
                EnableSsl = _options.UseSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            if (!string.IsNullOrWhiteSpace(_options.Usuario))
                cliente.Credentials = new NetworkCredential(_options.Usuario, _options.Contrasena);

            await cliente.SendMailAsync(mensaje, cancellationToken);
        }
    }
}