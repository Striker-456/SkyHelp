namespace Microservicios
{
    public class ExportacionesEstadisticas
    {
        public Guid IDExportado { get; set; }
        public Guid IDEstadisticas { get; set; }
        public string ExportadoPor { get; set; }
        public DateTime FechaExportacion { get; set; }
        public string Formato { get; set; }

    }
}
