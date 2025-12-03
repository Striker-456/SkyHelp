namespace SkyHelp.Repositories.Interfaces
{
    public interface IPedidosRepository
    {
        Task<List<Pedidos>> ObtenerPedidos();
        Task<Pedidos> ObtenerPedidoPorId(Guid id);
        Task<bool> CrearPedido(Pedidos pedido);
        Task<bool> ActualizarPedido(Pedidos pedido);
        Task<bool> EliminarPedido(Guid id);
    }
}
