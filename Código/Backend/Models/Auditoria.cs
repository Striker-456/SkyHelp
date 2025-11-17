using SkyHelp;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    public class Auditoria
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IDLog { get; set; } = Guid.NewGuid();
        [Required]
        [ForeignKey("Usuarios")]
        public Guid IDUsuario { get; set; }
        [Required]
        [StringLength(50)]
        public string TipoEvento { get; set; }
        [Required]
        [StringLength(50)]
        public string TablaAfectada { get; set; }
        [Required]
        public Guid IDRegistro { get; set; } = Guid.NewGuid();
        [Required]
        [StringLength(50)]
        public string Descripcion { get; set; }
        [Required]
        public DateTime FechaEvento { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }


    }
}
