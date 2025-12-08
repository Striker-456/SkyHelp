using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class ExportacionesEstadisticasRepository : IExportacionesEstadisticasRepository
    {
        private readonly SkyHelpContext _context;

        public ExportacionesEstadisticasRepository(SkyHelpContext context)
        {
            _context = context;
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
                // Log si lo manejas
                return false;
                throw new Exception(ex.Message.ToString());
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
                    throw new Exception("La exportación para actualizar no existe.");
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
                // Log si aplica
                return false;
                throw new Exception(ex.Message.ToString());
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
                    throw new Exception("La exportación para eliminar no existe.");
                }
                _context.ExportacionesEstadisticas.Remove(exportacionExistente);
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
