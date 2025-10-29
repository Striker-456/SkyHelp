namespace Microservicios
{
    public class Domiciliarios
    {
        public Guid IDDomiciliario { get; set; }
        public string NombreCompleto { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Estado { get; set; }
        public Guid IDUsuario { get; set; }
    }
}
