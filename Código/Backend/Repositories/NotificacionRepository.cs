using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class NotificacionRepository : INotificacionesRepository
    {
        private readonly SkyHelpContext _context;
        public NotificacionRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<Notificaciones> ObtenerNotificacionesPorId(Guid Id)
        {
            return await _context.Notificaciones.FirstOrDefaultAsync(x => x.IDNotificacion == Id);
        }
        public async Task<List<Notificaciones>> ObtenerPorUsuario(Guid idUsuario)
        {
            return await _context.Notificaciones
                .Where(n => n.IDUsuario == idUsuario)
                .OrderByDescending(n => n.FechaEnvio)
                .ToListAsync();
        }

        public async Task<bool> MarcarComoLeida(Guid id)
        {
            var notificacion = await _context.Notificaciones.FirstOrDefaultAsync(n => n.IDNotificacion == id);

            if (notificacion == null)
                return false;

            notificacion.Leido = true;
            await _context.SaveChangesAsync();
            return true;
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
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }

        public async Task<bool> EliminarNotificacion(Guid id)
        {
            try
            {
                var notificacionExistente = await _context.Notificaciones.FirstOrDefaultAsync(x => x.IDNotificacion == id);
                if (notificacionExistente == null)
                {
                    return false;
                    throw new Exception("Notificación para eliminar no existe.");
                }
                _context.Notificaciones.Remove(notificacionExistente);
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
