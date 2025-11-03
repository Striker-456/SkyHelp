using Microservicios;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IRolRepository
    {
        Task<Roles> ObtenerRoles(Guid id);

        Task<bool> AsignarRol(Roles roles);

        Task<bool> ActualizarRol(Guid id, Roles roles);
        Task<List<Roles>> ObtenerRoles();
        Task<bool> EliminarRol(Guid id);

    }
}
