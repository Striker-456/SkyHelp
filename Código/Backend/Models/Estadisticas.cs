using SkyHelp.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp
{
    public class Estadisticas
    {
        public Guid IdEstadisticas { get; set; }
        public string Periodo { get; set; }

        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string TipoGrafico { get; set; } 
        public string Datos { get; set; }
        public Guid IdUsuario { get; set; }
        public bool ExportadoExcel { get; set; }
        public bool ExportadoPDF { get; set; }
        public DateTime FechaGeneracion { get; set; }
        [JsonIgnore]
        public virtual Usuarios? Usuario { get; set; }
    }
}
