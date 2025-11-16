using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkyHelp
{
    public class Auditoria
    {
        public Guid IDLog { get; set; }
        public Guid IDUsuario { get; set; }
        public string TipoEvento { get; set; }
        public string TablaAfectada { get; set; }
        public string IDRegistro { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaEvento { get; set; }
    }
}
