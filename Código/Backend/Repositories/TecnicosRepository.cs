using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;


namespace SkyHelp.Repositories
{
    public class TecnicosRepository : ITecnicosRepository
    {
        private readonly SkyHelpContext _context;
        private readonly ILogger<TecnicosRepository> _logger;
        public TecnicosRepository(SkyHelpContext context, ILogger<TecnicosRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<List<Tecnicos>> ObtenerTecnicos()
        {
            return await _context.Tecnicos
                .Include(t => t.Usuario)
                .ToListAsync();
        }
        public async Task<Tecnicos> ObtenerTecnicoPorId(Guid id)
        {
            return await _context.Tecnicos.FirstOrDefaultAsync(x => x.IdTecnico == id);
        }

        public async Task<Tecnicos?> ObtenerTecnicoPorIdUsuario(Guid idUsuario)
        {
            return await _context.Tecnicos.FirstOrDefaultAsync(x => x.IdUsuario == idUsuario);
        }

        public async Task<bool> CrearTecnico(Tecnicos tecnico)
        {
            try
            {
                await _context.Tecnicos.AddAsync(tecnico);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el técnico para el usuario {IdUsuario}", tecnico.IdUsuario);
                return false;
            }
        }
    }
}
