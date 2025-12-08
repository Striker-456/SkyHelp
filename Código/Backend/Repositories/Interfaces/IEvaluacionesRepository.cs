using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IEvaluacionesRepository
    {
        Task<List<Evaluaciones>> ObtenerEvaluaciones();
        Task<Evaluaciones> ObtenerEvaluacionPorId(Guid id);
        Task<bool> CrearEvaluacion(Evaluaciones evaluacion);
        Task<bool> ActualizarEvaluacion(Evaluaciones evaluacion);
        Task<bool> EliminarEvaluacion(Guid id);
    }
}
