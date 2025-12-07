using SkyHelp.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace SkyHelp
{
    public class ExportacionesEstadisticas
    {
        public Guid IdExportado { get; set; }
        public Guid IdEstadisticas { get; set; }
        public string ExportadoPor { get; set; }
        public DateTime FechaExportacion { get; set; }
        public string Formato { get; set; }
        public virtual Estadisticas? Estadisticas { get; set; }

    }
}
