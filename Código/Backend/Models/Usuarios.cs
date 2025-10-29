using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Microservicios
{
    public class Usuarios
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IDUsuarios { get; set; }
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

        public ICollection <Roles> Rol { get; set; } // Relación muchos a muchos con Roles
    }
}
