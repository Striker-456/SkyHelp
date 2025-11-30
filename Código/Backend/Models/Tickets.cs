using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{ 
    public class Tickets
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IDTicket {  get ; set; } = Guid.NewGuid();
        [Required]
        [StringLength(200)]
        public string Descripcion { get; set; }
        [Required]
        [StringLength(50)]
        public string Categoria { get; set; }
        [Required]
        [StringLength(50)]
        public string Prioridad { get; set; }
        [Required]
        public DateTime FechaCreacion { get; set; } 
        [Required]
        public Guid IDEstado { get; set; }
        [Required]
        [ForeignKey("Usuario")]
        public Guid IDUsuario { get; set; }
        [Required]
        [ForeignKey("Domiciliario")]
        public Guid IDDomiciliarioAsignado { get; set; }
        [Required]
        [ForeignKey("Tecnico")]
        public Guid IDTecnicoAsignado { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }
        [JsonIgnore]
        public virtual Domiciliarios? Domiciliario { get; set; }
    }
}
