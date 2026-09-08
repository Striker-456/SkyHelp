using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class ExportacionesEstadisticasRepository : IExportacionesEstadisticasRepository
    {
        private readonly SkyHelpContext _context;
        private readonly ILogger<ExportacionesEstadisticasRepository> _logger;

        public ExportacionesEstadisticasRepository(SkyHelpContext context, ILogger<ExportacionesEstadisticasRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<List<ExportacionesEstadisticas>> ObtenerExportacionesEstadisticas()
        {
            return await _context.ExportacionesEstadisticas.ToListAsync();
        }
        public async Task<ExportacionesEstadisticas> ObtenerExportacionEstadisticaPorId(Guid id)
        {
            return await _context.ExportacionesEstadisticas.FirstOrDefaultAsync(x => x.IdExportado == id);
        }
        public async Task<bool> CrearExportacionEstadistica(ExportacionesEstadisticas exportacionEstadistica)
        {
            try
            {
                await _context.ExportacionesEstadisticas.AddAsync(exportacionEstadistica);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la exportación de estadística {IdEstadistica}", exportacionEstadistica.IdEstadistica);
                return false;
            }
        }
        public async Task<bool> ActualizarExportacionEstadistica(ExportacionesEstadisticas exportacionEstadistica)
        {
            try
            {
                var exportacionExistente = await _context.ExportacionesEstadisticas.FirstOrDefaultAsync(x => x.IdExportado == exportacionEstadistica.IdExportado);
                if (exportacionExistente == null)
                {
                    return false;
                }
                // Actualización campo por campo
                exportacionExistente.IdEstadistica = exportacionEstadistica.IdEstadistica;
                exportacionExistente.ExportadoPor = exportacionEstadistica.ExportadoPor;
                exportacionExistente.FechaExportacion = exportacionEstadistica.FechaExportacion;
                exportacionExistente.Formato = exportacionEstadistica.Formato;
                _context.ExportacionesEstadisticas.Update(exportacionExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la exportación de estadística {IdExportado}", exportacionEstadistica.IdExportado);
                return false;
            }
        }
        public async Task<bool> EliminarExportacionEstadistica(Guid id)
        {
            try
            {
                var exportacionExistente = await _context.ExportacionesEstadisticas.FirstOrDefaultAsync(x => x.IdExportado == id);
                if (exportacionExistente == null)
                {
                    return false;
                }
                _context.ExportacionesEstadisticas.Remove(exportacionExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la exportación de estadística {IdExportado}", id);
                return false;
            }
        }
    }
}
