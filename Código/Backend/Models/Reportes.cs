using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    public class Reportes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdReporte { get; set; } = Guid.NewGuid();
        [Required]
        [StringLength(50)]
        public string Titulo { get; set; }
        [Required]
        [StringLength(500)]
        public string Descripcion { get; set; }
        [Required]
        [StringLength(50)]
        public string TipoReporte { get; set; }
        [Required]
        public DateTime? FechaGeneracion { get; set; } = DateTime.Now;
        [Required]
        [ForeignKey("Usuario")]
        public Guid IdUsuario { get; set; }
        [Required]
        public Guid IdOrigen { get; set; } = Guid.NewGuid();
        [Required]  

        public String OrigenTabla { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }


    }
}
