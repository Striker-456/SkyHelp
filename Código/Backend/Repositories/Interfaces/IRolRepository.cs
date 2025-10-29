using Microservicios;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IRolRepository
    {
        Task<Roles> ObtenerRoles(int id);

        Task<bool> AsignarRol(Roles roles);

        Task<bool> ActualizarRol(Roles roles);
        Task<List<Roles>> ObtenerRoles();
        Task<bool> EliminarRol(int id);

    }
}
