
using SkyHelp.Models;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IUsuariosRepository
    {
        Task<List<Usuarios>> ObtenerUsuarios();

        Task<Usuarios> ObtenerUsuario(Guid id);

        Task<bool> CrearUsuario(Usuarios usuario);                                                          

        Task<bool> ActualizarUsuario(Usuarios usuario);

        Task<bool> EliminarUsuario(Guid id);
    }
}
