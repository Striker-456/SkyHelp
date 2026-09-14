using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class ReportesRepository : IReportesRepository
    {
        private readonly SkyHelpContext _context;
        private readonly ILogger<ReportesRepository> _logger;
        public ReportesRepository(SkyHelpContext context, ILogger<ReportesRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Reportes>> ObtenerReportes()
        {
            return await _context.Reportes.ToListAsync();
        }
        public async Task<Reportes> ObtenerReportesPorId(Guid id)
        {
            return await _context.Reportes.FirstOrDefaultAsync(x => x.IdReporte == id);
        }

        public async Task<bool> CrearReporte(Reportes reportes)
        {
            try
            {
                await _context.Reportes.AddAsync(reportes);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el reporte {TipoReporte}", reportes.TipoReporte);
                return false;
            }
        }
    }
}
