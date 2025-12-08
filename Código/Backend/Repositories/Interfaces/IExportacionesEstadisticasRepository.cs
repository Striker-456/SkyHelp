using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IExportacionesEstadisticasRepository
    {
        Task<List<ExportacionesEstadisticas>> ObtenerExportacionesEstadisticas();
        Task<ExportacionesEstadisticas> ObtenerExportacionEstadisticaPorId(Guid id);
        Task<bool> CrearExportacionEstadistica(ExportacionesEstadisticas exportacionEstadistica);
        Task<bool> ActualizarExportacionEstadistica(ExportacionesEstadisticas exportacionEstadistica);
        Task<bool> EliminarExportacionEstadistica(Guid id);

    }
}
