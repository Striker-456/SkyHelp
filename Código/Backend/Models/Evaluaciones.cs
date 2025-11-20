namespace Microservicios
{
    public class Evaluaciones
    {
        public Guid IDEvaluacion { get; set; }
        public Guid IDUsuario { get; set; }
        public Guid IDTicket { get; set; }
        public int Calificacion { get; set; }
        public string Comentario { get; set; }
        public DateTime FechaEvaluacion { get; set; }
    }
}
