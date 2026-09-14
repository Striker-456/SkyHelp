using SkyHelp.Models;
namespace SkyHelp.Repositories.Interfaces
{
    public interface IPedidosRepository
    {
        Task<List<Pedidos>> ObtenerPedidos();
        Task<List<Pedidos>> ObtenerPedidosPorDomiciliario(Guid idDomiciliario);
        Task<Pedidos?> ObtenerPedidoPorIdTicket(Guid idTicket);
        Task<bool> CrearPedido(Pedidos pedido);
        Task<bool> ActualizarPedido(Pedidos pedido);
    }
}
