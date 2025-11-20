namespace Microservicios
{
    public class Estadisticas
    {
        public Guid IDEstadisticas { get; set; }
        public string Periodo { get; set; }

        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string TipoGrafico { get; set; } 
        public string Datos { get; set; }
        public Guid IDUsuarioGenera { get; set; }
        public bool ExportadoExcel { get; set; }
        public bool ExportadoPDF { get; set; }
        public DateTime FechaGeneracion { get; set; }
    }
}
