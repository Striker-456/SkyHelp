using SkyHelp.DTOs.Pedidos;

namespace SkyHelp.Services.Interfaces
{
    public interface IPedidosService
    {
        // Regla de negocio: el domiciliario confirma que el equipo fue entregado -> se registra la
        // fecha/hora de entrega, el pedido pasa a "Entregado" y el ticket asociado se cierra solo.
        Task<ConfirmarEntregaResultado> ConfirmarEntregaAsync(Guid idTicket, Guid idUsuarioActor, bool actorEsAdmin, string? ip);
    }
}
