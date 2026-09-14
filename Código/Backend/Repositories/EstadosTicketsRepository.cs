using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class EstadosTicketsRepository : IEstadosTicketsRepository
    {
        private readonly SkyHelpContext _context;// Inyección de dependencia del contexto de la base de datos
        public EstadosTicketsRepository(SkyHelpContext context)
        {
            _context = context;
        }

        public async Task<List<EstadosTicket>> ObtenerEstadosTickets()
        {
            return await _context.EstadosTickets.ToListAsync();
        }
    }
}
