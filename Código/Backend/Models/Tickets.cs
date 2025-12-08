using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{ 
    public class Tickets
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdTicket {  get ; set; } = Guid.NewGuid();
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
        public DateTime? FechaCreacion { get; set; } = DateTime.Now;
        [Required]
        public Guid IdEstado { get; set; }
        [Required]
        [ForeignKey("Usuario")]
        public Guid IdUsuario { get; set; }
        [Required]
        [ForeignKey("Domiciliario")]
        public Guid IdDomiciliario { get; set; }
        [Required]
        [ForeignKey("Tecnico")]
        public Guid IdTecnico { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }
        [JsonIgnore]
        public virtual Domiciliarios? Domiciliario { get; set; }
        [JsonIgnore]
        public virtual Tecnicos? Tecnico { get; set; }
        [JsonIgnore]
        public virtual EstadosTicket? EstadoTicket { get; set; }
        [JsonIgnore]
        public virtual ICollection<Evaluaciones>? Evaluaciones { get; set; }
    }
}
