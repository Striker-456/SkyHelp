using SkyHelp.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp
{
    public class Estadisticas
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdEstadistica { get; set; } = Guid.NewGuid();

        public required string Periodo { get; set; }

        public DateTime? FechaInicio { get; set; } = DateTime.Now;
        public DateTime? FechaFin { get; set; } = DateTime.Now;
        public required string TipoGrafico { get; set; } 
        public required string Datos { get; set; }
        public Guid IdUsuario { get; set; }
        public bool ExportadoExcel { get; set; }
        public bool ExportadoPDF { get; set; }
        public DateTime? FechaGeneracion { get; set; } = DateTime.Now;
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }

        [JsonIgnore]
        public virtual ICollection<ExportacionesEstadisticas>? ExportacionesEstadisticas { get; set; }
    }
}
