using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;
using System.Linq.Expressions;
using Microservicios;

namespace SkyHelp.Repositories
{
    public class AuthRepository: IAuthRepository
    {
        private readonly SkyHelpContext _context;
        public AuthRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<Usuarios> IniciarSesion(string correo, string contrasena)
        {
            var usuarioExistente = await _context.Login.FirstOrDefaultAsync(u => u.Correo == correo && u.Contrasena ==  contrasena);
            return usuarioExistente;
        }
        public async Task<Usuarios> CerrarSesion(Usuarios usuario)
        {
            // Implementar la lógica de cierre de sesión si es necesario
            return await Task.FromResult(usuario);
        }
    }
}
