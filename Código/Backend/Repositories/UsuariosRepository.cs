using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;
using System.Linq.Expressions;
namespace SkyHelp.Repositories
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly SkyHelpContext _context;
        public UsuariosRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<Usuarios> ObtenerUsuario(Guid id)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(x => x.IDUsuarios == id);
        }

        public async Task<List<Usuarios>> ObtenerUsuario()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<bool> EliminarUsuario(Guid id)
        {
            try
            {
                var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(x => x.IDUsuarios == id);
                if (usuarioExistente == null)
                {
                    return false;
                    throw new Exception("Usuario Para Actualizar No Existe");
                }

                _context.Usuarios.Remove(usuarioExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }

        public async Task<bool> ActualizarUsuario(Guid id, Usuarios usuario)
        {
            try
            {
                var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(x => x.IDUsuarios == id);
                if (usuarioExistente == null)
                {
                    return false;
                    throw new Exception("Usuario Para Actualizar No Existe");
                }

                usuarioExistente.NombreUsuarios = usuario.NombreUsuarios;
                usuarioExistente.NombreCompleto = usuario.NombreCompleto;
                usuarioExistente.Correo = usuario.Correo;
                usuarioExistente.Contrasena = usuario.Contrasena;
                usuarioExistente.EstadoCuenta = usuario.EstadoCuenta;

                _context.Usuarios.Update(usuarioExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }

        public async Task<bool> CrearUsuario(Usuarios usuario)
        {
            try
            {
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
    }
}
