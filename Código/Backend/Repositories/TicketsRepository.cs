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
                var ticketExistente = await _context.Tickets.FirstOrDefaultAsync(x => x.IdTicket == ticket.IdTicket);
                if (ticketExistente == null)
                {
                    return false;
                    throw new Exception("Ticket Para Actualizar No Existe");
                }
                ticketExistente.Descripcion = ticket.Descripcion;
                ticketExistente.Categoria = ticket.Categoria;
                ticketExistente.Prioridad = ticket.Prioridad;
                ticketExistente.FechaCreacion = ticket.FechaCreacion;
                ticketExistente.IdEstado = ticket.IdEstado;
                ticketExistente.IdUsuario = ticket.IdUsuario;
                ticketExistente.IdDomiciliario = ticket.IdDomiciliario;
                ticketExistente.IdTecnico = ticket.IdTecnico;
                _context.Tickets.Update(ticketExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
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
