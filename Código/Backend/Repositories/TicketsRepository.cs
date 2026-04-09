using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class TicketsRepository : ITicketsRepository
    {
        private readonly SkyHelpContext _context;// Inyección de dependencia del contexto de la base de datos
        public TicketsRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<List<Tickets>> ObtenerTickets()
        {
            return await _context.Tickets.ToListAsync();
        }

        public async Task<List<Tickets>> ObtenerTicketsPorUsuario(Guid idUsuario)
        {
            return await _context.Tickets.Where(t => t.IdUsuario == idUsuario).ToListAsync();
        }

        public async Task<List<Tickets>> ObtenerTicketsPorTecnico(Guid idTecnico)
        {
            return await _context.Tickets.Where(t => t.IdTecnico == idTecnico).ToListAsync();
        }

        public async Task<Tickets> ObtenerTicketPorId(Guid id)
        {
            return await _context.Tickets.FirstOrDefaultAsync(x => x.IdTicket == id);
        }
        public async Task<bool> CrearTicket(Tickets ticket)
        {
            try
            {
                await _context.Tickets.AddAsync(ticket);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> ActualizarTicket(Tickets ticket)
        {
            try
            {
                if (ticket == null || ticket.IdTicket == Guid.Empty)
                    throw new ArgumentException("Ticket nulo o sin ID");

                // Obtener el ticket existente sin rastreo
                var ticketExistente = await _context.Tickets.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.IdTicket == ticket.IdTicket);
                
                if (ticketExistente == null)
                    throw new KeyNotFoundException($"Ticket con ID {ticket.IdTicket} no encontrado");

                // Actualizar solo el estado
                ticketExistente.IdEstado = ticket.IdEstado;

                // Ahora adjuntar y marcar como modificado
                _context.Tickets.Attach(ticketExistente);
                _context.Entry(ticketExistente).Property(x => x.IdEstado).IsModified = true;

                var cambios = await _context.SaveChangesAsync();
                return cambios > 0;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en ActualizarTicket: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Inner: {ex.InnerException?.Message}");
                throw;
            }
        }

        public async Task<bool> EliminarTicket(Guid id)
        {
            try
            {
                var ticketExistente = await _context.Tickets.FirstOrDefaultAsync(x => x.IdTicket == id);
                if (ticketExistente == null)
                {
                    return false;
                    throw new Exception("Ticket Para Eliminar No Existe");
                }
                _context.Tickets.Remove(ticketExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
    }
}
