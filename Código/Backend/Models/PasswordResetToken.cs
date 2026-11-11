using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    /// <summary>
    /// Token de un solo uso para el restablecimiento de contraseña por enlace temporal.
    ///
    /// Seguridad:
    /// - El token en claro NUNCA se guarda: solo se persiste su hash SHA-256.
    ///   Si la base de datos se ve comprometida, los enlaces pendientes no son utilizables.
    /// - Tiene fecha de expiración (por defecto 30 minutos).
    /// - Es de un solo uso: se marca como consumido al aplicarse.
    /// - Se invalida al generar uno nuevo para el mismo usuario.
    /// </summary>
    public class PasswordResetToken
    {
        [Key]
        public Guid IdToken { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey(nameof(Usuario))]
        public Guid IdUsuario { get; set; }

        /// <summary>Hash SHA-256 (hex) del token enviado por correo.</summary>
        [Required]
        [StringLength(64)]
        public required string TokenHash { get; set; }

        [Required]
        public DateTime FechaExpiracion { get; set; }

        [Required]
        public DateTime FechaCreacion { get; set; }

        public DateTime? FechaUso { get; set; }

        /// <summary>Dirección IP que solicitó el restablecimiento (trazabilidad / auditoría).</summary>
        [StringLength(45)]
        public string? SolicitadoDesdeIp { get; set; }

        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }

        [JsonIgnore]
        public bool EstaVigente => FechaUso == null && DateTime.UtcNow < FechaExpiracion;
    }
}