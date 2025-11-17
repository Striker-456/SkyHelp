using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    namespace SkyHelp.Repositories.Interfaces
    {
        public interface IDomiciliariosRepository
        {
            Task<List<Domiciliarios>> ObtenerDomiciliarios();
            Task<Domiciliarios> ObtenerDomiciliarioPorID(Guid id);
            Task<bool> CrearDomiciliario(Domiciliarios domiciliario);
            Task<bool> ActualizarDomiciliario(Domiciliarios domiciliario);
            Task<bool> EliminarDomiciliario(Guid id);
        }
    }
}
