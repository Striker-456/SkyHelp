using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IEstadosTicketsRepository
    {
        Task<List<EstadosTicket>> ObtenerEstadosTickets();
    }
}
