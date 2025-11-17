using SkyHelp;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    public class Usuarios
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IDUsuarios { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("Rol")]
        public Guid IDRol { get; set; }
        [Required]
        [StringLength(50)]
        public string NombreUsuarios { get; set; }
        [Required]
        [StringLength(100)]
        public string NombreCompleto { get; set; }
        [Required]
        [StringLength(50)]
        public string Correo { get; set; }
        [Required]
        [StringLength(50)]
        public string Contrasena { get; set; }
        [Required]
        [StringLength(50)]
        public string EstadoCuenta { get; set; }
        [JsonIgnore]
        public virtual Roles? Rol { get; set; } 
        [JsonIgnore]

        public virtual ICollection<Auditoria>? Auditorias { get; set; }
    }
}
