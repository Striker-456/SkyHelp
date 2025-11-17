using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    public class Articulos
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IDArticulo { get; set; } = Guid.NewGuid();
        [Required]
        [StringLength(50)]
        public string Titulo { get; set; }
        [Required]
        [StringLength(50)]
        public string Categoria { get; set; }
        [Required]
        [StringLength(50)]
        public string Contenido { get; set; }
        public DateTime Fecha_Publicacion { get; set; }
        public int  TotalVistas { get; set; } 
        public decimal CalificacionPromedio { get; set; }
        [Required]
        [ForeignKey("Usuario")]
        public Guid IDUsuario { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }

    }
}
