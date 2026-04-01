using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface ITicketsRepository
    {
        Task<List<Tickets>> ObtenerTickets();
        Task<List<Tickets>> ObtenerTicketsPorUsuario(Guid idUsuario);
        Task<List<Tickets>> ObtenerTicketsPorTecnico(Guid idTecnico);
        Task<Tickets> ObtenerTicketPorId(Guid id);
        Task<bool> CrearTicket(Tickets ticket);
        Task<bool> ActualizarTicket(Tickets ticket);
        Task<bool> EliminarTicket(Guid id);

    }
}
