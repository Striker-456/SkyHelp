using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IReportesRepository
    {
        Task<List<Reportes>> ObtenerReportes();

        Task<Reportes> ObtenerReportesPorId(Guid id);

        Task<bool> CrearReporte(Reportes reportes);
    }
}
