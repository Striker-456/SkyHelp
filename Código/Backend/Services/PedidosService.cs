using SkyHelp.DTOs.Pedidos;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Services.Interfaces;

namespace SkyHelp.Services
{
    public class PedidosService : IPedidosService
    {
        private readonly ITicketsRepository _ticketsRepository;
        private readonly IPedidosRepository _pedidosRepository;
        private readonly IDomiciliariosRepository _domiciliariosRepository;
        private readonly IEstadosTicketsRepository _estadosTicketsRepository;
        private readonly IAuditoriaService _auditoriaService;

        public PedidosService(
            ITicketsRepository ticketsRepository,
            IPedidosRepository pedidosRepository,
            IDomiciliariosRepository domiciliariosRepository,
            IEstadosTicketsRepository estadosTicketsRepository,
            IAuditoriaService auditoriaService)
        {
            _ticketsRepository = ticketsRepository;
            _pedidosRepository = pedidosRepository;
            _domiciliariosRepository = domiciliariosRepository;
            _estadosTicketsRepository = estadosTicketsRepository;
            _auditoriaService = auditoriaService;
        }

        public async Task<ConfirmarEntregaResultado> ConfirmarEntregaAsync(Guid idTicket, Guid idUsuarioActor, bool actorEsAdmin, string? ip)
        {
            var ticket = await _ticketsRepository.ObtenerTicketPorId(idTicket);
            if (ticket == null)
                return new ConfirmarEntregaResultado { NoEncontrado = true, Mensaje = "Ticket no encontrado." };

            if (!actorEsAdmin)
            {
                var domiciliario = await _domiciliariosRepository.ObtenerDomiciliarioPorIdUsuario(idUsuarioActor);
                if (domiciliario == null || ticket.IdDomiciliario != domiciliario.IdDomiciliario)
                    return new ConfirmarEntregaResultado { NoAutorizado = true, Mensaje = "No tiene permisos sobre este ticket." };
            }

            if (ticket.IdDomiciliario == null)
                return new ConfirmarEntregaResultado { Mensaje = "El ticket no tiene un domiciliario asignado." };

            var ahora = DateTime.Now;
            var pedido = await _pedidosRepository.ObtenerPedidoPorIdTicket(idTicket);

            if (pedido != null)
            {
                pedido.EstadoPedido = "Entregado";
                pedido.FechaEntrega = ahora;
                await _pedidosRepository.ActualizarPedido(pedido);
            }
            else
            {
                pedido = new Pedidos
                {
                    IdUsuario = ticket.IdUsuario,
                    IdDomiciliario = ticket.IdDomiciliario.Value,
                    IdTicket = idTicket,
                    FechaPedido = ticket.FechaCreacion ?? ahora,
                    FechaEntrega = ahora,
                    DireccionEntrega = "Sin dirección registrada en el ticket",
                    EstadoPedido = "Entregado",
                    Observaciones = string.Empty
                };
                await _pedidosRepository.CrearPedido(pedido);
            }

            // Cerrar automáticamente el ticket asociado (esto también marca Tickets.FechaCierre,
            // ver TicketsRepository.ActualizarEstadoTicket).
            var estados = await _estadosTicketsRepository.ObtenerEstadosTickets();
            var estadoResuelto = estados.FirstOrDefault(e => e.NombreEstado.Contains("resuelto", StringComparison.OrdinalIgnoreCase));
            if (estadoResuelto != null)
                await _ticketsRepository.ActualizarEstadoTicket(idTicket, estadoResuelto.IdEstado);

            await _auditoriaService.RegistrarAsync(idUsuarioActor, "Actualizar", "Pedidos", pedido.IdPedido,
                $"Entrega confirmada para el ticket #{ticket.NumeroTicket}: pedido marcado como Entregado y ticket cerrado.", ip);

            return new ConfirmarEntregaResultado { Exitoso = true };
        }
    }
}
