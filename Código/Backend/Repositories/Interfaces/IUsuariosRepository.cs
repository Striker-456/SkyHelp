
using Microservicios;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IUsuariosRepository
    {
        Task<List<Usuarios>> ObtenerUsuario();

        Task<Usuarios> ObtenerUsuario(int id);

        Task<bool> CrearUsuario(Usuarios usuario);

        Task<bool> ActualizarUsuario(Usuarios usuario);

        Task<bool> EliminarUsuario(int id);
    }
}
