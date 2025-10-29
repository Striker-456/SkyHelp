namespace Microservicios
{
    public class Notificaciones
    {
        public Guid IDNotificacion { get; set; }
        public Guid IDUsuario { get; set; }
        public string Contenido { get; set; }
        public DateTime FechaEnvio { get; set; }
        public string MedioEnvio { get; set; }
        public Guid IDTicket { get; set; }

    }
}
