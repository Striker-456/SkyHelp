using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class DomiciliariosRepository : IDomiciliariosRepository
    {
        private readonly SkyHelpContext _context; // Inyección de dependencia del contexto de la base de datos
        private readonly ILogger<DomiciliariosRepository> _logger;

        public DomiciliariosRepository(SkyHelpContext context, ILogger<DomiciliariosRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Domiciliarios>> ObtenerDomiciliarios()
        {
            return await _context.Domiciliarios.ToListAsync();
        }

        public async Task<Domiciliarios?> ObtenerDomiciliarioPorIdUsuario(Guid idUsuario)
        {
            return await _context.Domiciliarios.FirstOrDefaultAsync(x => x.IDUsuario == idUsuario);
        }

        public async Task<Domiciliarios> ObtenerDomiciliarioPorID(Guid id)
        {
            return await _context.Domiciliarios.FirstOrDefaultAsync(x => x.IdDomiciliario == id);
        }

        public async Task<bool> CrearDomiciliario(Domiciliarios domiciliario)
        {
            try
            {
                await _context.Domiciliarios.AddAsync(domiciliario);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el domiciliario para el usuario {IDUsuario}", domiciliario.IDUsuario);
                return false;
            }
        }

    }
}
