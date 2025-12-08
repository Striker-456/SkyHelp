using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp.Models
{
    public class Evaluaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdEvaluacion { get; set; } = Guid.NewGuid();
        [Required]
        public Guid IdUsuario { get; set; }
        [Required]
        public Guid IdTicket { get; set; }
        [Required]
        public int Calificacion { get; set; }
        [Required]
        public string Comentario { get; set; }
        [Required]
        public DateTime? FechaEvaluacion { get; set; } = DateTime.Now;
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }
        [JsonIgnore]
        public virtual Tickets? Ticket { get; set; }
    }
}
