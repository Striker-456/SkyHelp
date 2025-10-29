namespace Microservicios
{
    public class Pedidos
    {
        public Guid IDPedido { get; set; }
        public Guid IDUsuario { get; set; }
        public string IDDomiciliario { get; set; }
        public DateTime FechaPedido { get; set; }
        public string DireccionEntrega { get; set; }
        public string Estado { get; set; }
        public string Observaciones  { get; set; }
    }
}
