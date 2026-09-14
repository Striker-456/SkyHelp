using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Models;
namespace SkyHelp.Repositories
{
    public class RolRepository : IRolRepository
    {
        private readonly SkyHelpContext _context;// Inyección de dependencia del contexto de la base de datos
        public RolRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<List<Roles>> ObtenerRoles()
        {
            return await _context.Roles.ToListAsync();
        }
        public async Task<Roles> ObtenerRolesPorID(Guid id)
        {
            return await _context.Roles.FirstOrDefaultAsync(x => x.IDRol == id);
        }
    }
}
