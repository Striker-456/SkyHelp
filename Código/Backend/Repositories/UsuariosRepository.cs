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
                    throw new Exception("Usuario para eliminar no existe");
                }

                // Eliminar registros relacionados primero
                // Eliminar domiciliarios asociados
                var domiciliarios = await _context.Domiciliarios.Where(d => d.IDUsuario == id).ToListAsync();
                _context.Domiciliarios.RemoveRange(domiciliarios);

                // Eliminar técnicos asociados
                var tecnicos = await _context.Tecnicos.Where(t => t.IdUsuario == id).ToListAsync();
                _context.Tecnicos.RemoveRange(tecnicos);

                // Eliminar tickets asociados (como cliente)
                var ticketsCliente = await _context.Tickets.Where(t => t.IdUsuario == id).ToListAsync();
                _context.Tickets.RemoveRange(ticketsCliente);

                // Eliminar auditorías asociadas
                var auditorias = await _context.Auditoria.Where(a => a.IDUsuario == id).ToListAsync();
                _context.Auditoria.RemoveRange(auditorias);

                // Finalmente, eliminar el usuario
                _context.Usuarios.Remove(usuarioExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> ActualizarUsuario( Usuarios usuario)
        {
            try
            {
                var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == usuario.IdUsuario);
                if (usuarioExistente == null)
                {
                    throw new Exception("Usuario para actualizar no existe");
                }

                usuarioExistente.NombreUsuarios = usuario.NombreUsuarios;
                usuarioExistente.IdRol = usuario.IdRol;
                usuarioExistente.NombreCompleto = usuario.NombreCompleto;
                usuarioExistente.Correo = usuario.Correo;
                usuarioExistente.EstadoCuenta = usuario.EstadoCuenta;
                usuarioExistente.Telefono = usuario.Telefono;

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
                throw new Exception(ex.Message);
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
                throw; // propaga la excepción original con todo el inner exception
            }
        }
    }
}
