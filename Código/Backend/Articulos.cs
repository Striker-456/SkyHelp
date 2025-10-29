namespace Microservicios
{
    public class Articulos
    {
        public Guid IDArticulo { get; set; }
        public string Titulo { get; set; }
        public string Categoria { get; set; }
        public string Contenido { get; set; }
        public DateTime FechaPublicacion { get; set; }
        public int  TotalVistas { get; set; } 
        public decimal CalificacionPromedio { get; set; }   
        public Guid AutorID { get; set; }
    }
}
