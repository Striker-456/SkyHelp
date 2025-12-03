using SkyHelp.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp
{
    public class Pedidos
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdPedido { get; set; } = Guid.NewGuid();
        [Required]
        public Guid IdUsuario { get; set; }
        [Required]
        public Guid IdDomiciliario { get; set; }
        public DateTime? FechaPedido { get; set; } = DateTime.Now;
        [Required]
        public string DireccionEntrega { get; set; }
        [Required]
        public string EstadoPedido { get; set; }

        public string Observaciones  { get; set; }

        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }
        [JsonIgnore]
        public virtual Domiciliarios? Domiciliario { get; set; }

    }
}
