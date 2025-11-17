namespace Microservicios
{
    public class Domiciliarios
    {
        public Guid  IDDomiciliario { get; set; } = Guid.NewGuid();
        public string NombreCompleto { get; set; }
        public string Apellidos { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Estado { get; set; } // Activo / Inactivo
        public string PlacaVehiculo { get; set; }//Tipo de Vehiculo y la identificacion del vehiculo
        public Guid IDUsuario { get; set; }
    }
}
