using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IRolRepository
    {
        Task<List<Roles>> ObtenerRoles();
        Task<Roles> ObtenerRolesPorID(Guid id);
    }
}
