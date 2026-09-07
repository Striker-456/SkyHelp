using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class NotificacionRepository : INotificacionesRepository
    {
        private readonly SkyHelpContext _context;
        private readonly ILogger<NotificacionRepository> _logger;
        public NotificacionRepository(SkyHelpContext context, ILogger<NotificacionRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Notificaciones>> ObtenerNotificaciones()
        {
            return await _context.Notificaciones.ToListAsync();
        }
        public async Task<Notificaciones> ObtenerNotificacionesPorId(Guid Id)
        {
            return await _context.Notificaciones.FirstOrDefaultAsync(x => x.IdNotificacion == Id);
        }
        public async Task<List<Notificaciones>> ObtenerPorUsuario(Guid idUsuario)
        {
            return await _context.Notificaciones
                .Where(n => n.IdUsuario == idUsuario)
                .OrderByDescending(n => n.FechaEnvio)
                .ToListAsync();
        }
        public async Task<bool> CrearNotificacion(Notificaciones notificacion)
        {
            try
            {
                await _context.Notificaciones.AddAsync(notificacion);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la notificación para el usuario {IdUsuario}", notificacion.IdUsuario);
                return false;
            }
        }

        public async Task<bool> EliminarNotificacion(Guid id)
        {
            try
            {
                var notificacionExistente = await _context.Notificaciones.FirstOrDefaultAsync(x => x.IdNotificacion == id);
                if (notificacionExistente == null)
                {
                    return false;
                }
                _context.Notificaciones.Remove(notificacionExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la notificación {IdNotificacion}", id);
                return false;
            }
        }
    }
}
