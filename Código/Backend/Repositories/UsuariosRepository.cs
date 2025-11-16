using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.EncriptarSHA256;
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

        public async Task<List<Usuarios>> ObtenerUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }
        public async Task<Usuarios> ObtenerPersonaPorCorreo(string username)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(x => x.Correo == username);
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

        public async Task<bool> ActualizarUsuario( Usuarios usuario)
        {
            try
            {
                var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(x => x.IDUsuarios == usuario.IDUsuarios);
                if (usuarioExistente == null)
                {
                    return false;
                    throw new Exception("Usuario Para Actualizar No Existe");
                }

                usuarioExistente.NombreUsuarios = usuario.NombreUsuarios;
                usuarioExistente.NombreCompleto = usuario.NombreCompleto;
                usuarioExistente.Correo = usuario.Correo;
                usuarioExistente.Contraseña = usuario.Contraseña;
                usuarioExistente.EstadoCuenta = usuario.EstadoCuenta;

                if (!string.IsNullOrWhiteSpace(usuario.Contraseña))
                {
                    usuarioExistente.Contraseña = Seguridad.EncriptarSHA256(usuario.Contraseña);
                }


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

                usuario.Contraseña = Seguridad.EncriptarSHA256(usuario.Contraseña);

                if (usuario.IDUsuarios == Guid.Empty)
                {
                    usuario.IDUsuarios = Guid.NewGuid();
                }

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
