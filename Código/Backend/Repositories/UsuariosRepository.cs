using Microsoft.EntityFrameworkCore;
using SkyHelp;
using SkyHelp.Context;
using SkyHelp.EncriptarSHA256;
using SkyHelp.Models;
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
            return await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == id);
        }

        public async Task<Usuarios> ObtenerUsuarioPorCorreo(string Correo)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(x => x.Correo == Correo);
        }

        public async Task<List<Usuarios>> ObtenerUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<bool> EliminarUsuario(Guid id)
        {
            try
            {
                var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == id);
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
                var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == usuario.IdUsuario);
                if (usuarioExistente == null)
                {
                    return false;
                    throw new Exception("Usuario Para Actualizar No Existe");
                }

                usuarioExistente.NombreUsuarios = usuario.NombreUsuarios;
                usuarioExistente.IdRol = usuario.IdRol;
                usuarioExistente.NombreCompleto = usuario.NombreCompleto;
                usuarioExistente.Correo = usuario.Correo;
                usuarioExistente.Contrasena = usuario.Contrasena;
                usuarioExistente.EstadoCuenta = usuario.EstadoCuenta;

                if (!string.IsNullOrWhiteSpace(usuario.Contrasena))
                {
                    usuarioExistente.Contrasena = Seguridad.EncriptarSHA256(usuario.Contrasena);
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

                usuario.Contrasena = Seguridad.EncriptarSHA256(usuario.Contrasena);

                if (usuario.IdUsuario == Guid.Empty)
                {
                    usuario.IdUsuario = Guid.NewGuid();
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
