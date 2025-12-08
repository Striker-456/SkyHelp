using SkyHelp.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace SkyHelp
{
    public class ExportacionesEstadisticas
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid IdExportado { get; set; } = Guid.NewGuid();
        [ForeignKey("Estadistica")]
        public Guid IdEstadistica { get; set; }
        public string ExportadoPor { get; set; }
        public DateTime? FechaExportacion { get; set; } = DateTime.Now;
        public string Formato { get; set; }
        [JsonIgnore]
        public virtual Estadisticas? Estadistica { get; set; }

    }
}
