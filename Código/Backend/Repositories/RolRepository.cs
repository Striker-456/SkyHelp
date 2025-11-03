using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;
using System.Linq.Expressions;
namespace SkyHelp.Repositories
{
    public class RolRepository : IRolRepository
    {
        private readonly SkyHelpContext _context;
        public RolRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<Roles> ObtenerRoles(Guid id)
        {
            return await _context.Roles.FirstOrDefaultAsync(x => x.IDRol == id);
        }
        public async Task<bool> AsignarRol(Roles roles)
        {
            try
            {
                await _context.Roles.AddAsync(roles);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> ActualizarRol(Guid id, Roles roles)
        {
            try
            {
                var rolExistente = await _context.Roles.FirstOrDefaultAsync(x => x.IDRol == id);
                if (rolExistente == null)
                {
                    return false;
                    throw new Exception("Rol Para Actualizar No Existe");
                }
                rolExistente.NombreRol = roles.NombreRol;
                rolExistente.Descripcion = roles.Descripcion;
                _context.Roles.Update(rolExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<List<Roles>> ObtenerRoles()
        {
            return await _context.Roles.ToListAsync();
        }
        public async Task<bool> EliminarRol(Guid id)
        {
            try
            {
                var rolExistente = await _context.Roles.FirstOrDefaultAsync(x => x.IDRol == id);
                if (rolExistente == null)
                {
                    return false;
                    throw new Exception("Rol Para Eliminar No Existe");
                }
                _context.Roles.Remove(rolExistente);
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
