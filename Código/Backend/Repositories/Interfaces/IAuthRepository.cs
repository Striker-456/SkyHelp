using Microservicios;
namespace SkyHelp.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<Usuarios> IniciarSesion(string correo,string contrasena);
        Task<Usuarios> CerrarSesion(Usuarios usuario);
    }
}
