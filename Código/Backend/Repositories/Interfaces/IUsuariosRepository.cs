
using Microservicios;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IUsuariosRepository
    {
        Task<List<Usuarios>> ObtenerUsuario();

        Task<Usuarios> ObtenerUsuario(Guid id);

        Task<bool> CrearUsuario(Usuarios usuario);

        Task<bool> ActualizarUsuario(Guid id, Usuarios usuario);

        Task<bool> EliminarUsuario(Guid id);
    }
}
