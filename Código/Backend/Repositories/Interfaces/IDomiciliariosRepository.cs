using Microservicios;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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
