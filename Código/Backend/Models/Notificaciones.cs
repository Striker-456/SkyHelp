using SkyHelp.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp
{
    public class Notificaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdNotificacion { get; set; } = Guid.NewGuid();
        [Required]
        public Guid IdUsuario { get; set; }
        [Required]
        [StringLength(50)]
        public string Contenido { get; set; }
        public DateTime? FechaEnvio { get; set; }= DateTime.Now;
        [Required]
        [StringLength(50)]
        public string MedioEnvio { get; set; }
        public bool Leido { get; set; } = false;
        [Required]
        public Guid IDTicket { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }
        [JsonIgnore]
        public virtual Tickets? Ticket { get; set; }





    }
}
