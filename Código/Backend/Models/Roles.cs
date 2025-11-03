using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Microservicios
{
    public class Roles
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IDRol { get; set; } // Llave primaria
        [Required]
        [StringLength(50)]  
        public string NombreRol { get; set; }   
        [StringLength(200)]
        public string Descripcion { get; set; }
        
        public ICollection<Usuarios> Usuario { get; set; }// Relación muchos a muchos con Usuarios
    }
}
