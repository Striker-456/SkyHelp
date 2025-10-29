namespace Microservicios
{
    public class Tickets
    {
        public Guid IDTicket {  get ; set; }    
        public string Descripcion { get; set; }
        public string Categoria { get; set; }
        public string Prioridad { get; set; }
        public DateTime FechaCreacion { get; set; } 
        public Guid IDEstado { get; set; }
        public Guid IDUsuarioSolicitante { get; set; }
        public Guid IDDomiciliarioAsignado { get; set; }
        public Guid IDTecnicoAsignado { get; set; }
    }
}
