using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    public class Reportes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IDReporte { get; set; } = Guid.NewGuid();
        [Required]
        [StringLength(50)]
        public string Titulo { get; set; }
        [Required]
        [StringLength(50)]
        public string TipoReporte { get; set; }
        [Required]
        [StringLength(50)]
        public string FechaGeneracion { get; set; }
        [Required]
        [ForeignKey("Usuario")]
        public Guid IDUsuario { get; set; }
        [Required]
        public Guid IdOrigen { get; set; } = Guid.NewGuid();
        [Required]  
        public String OrigenTabla { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }


    }
}
