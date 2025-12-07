using Microservicios;
using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IEstadisticasRepository
    {
        Task<List<Estadisticas>> ObtenerEstadisticas();
        Task<Estadisticas> ObtenerEstadisticaPorId(Guid id);
        Task<bool> CrearEstadistica(Estadisticas estadistica);
        Task<bool> ActualizarEstadistica(Estadisticas estadistica);
        Task<bool> EliminarEstadistica(Guid id);

    }
}
