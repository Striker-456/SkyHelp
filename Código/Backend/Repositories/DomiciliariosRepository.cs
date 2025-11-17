using Microservicios;
using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;


namespace SkyHelp.Repositories
{
    public class DomiciliariosRepository : IDomiciliariosRepository
    {
        private readonly SkyHelpContext _context;

        public DomiciliariosRepository(SkyHelpContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Domiciliarios>> TodosLosDomiciliariosAsync()
        {
            return await _context.Domiciliarios.ToListAsync();
        }

        public async Task<Domiciliarios> DomiciliariosIdAsync(Guid id)
        {
            return await _context.Domiciliarios.FindAsync(id);
        }   
        public async Task<Domiciliarios> DomiciliariosCreadosAsync(Domiciliarios domiciliario)
        {
            _context.Domiciliarios.Add(domiciliario);
            await  _context.SaveChangesAsync();
            return domiciliario;
        }
        
        public async Task<Domiciliarios> ActualizarDomiciliariosAsync(Domiciliarios domiciliario)
        {
            _context.Domiciliarios.Update(domiciliario);
            await _context.SaveChangesAsync();
            return domiciliario;
        }
        public async Task<bool> EliminarDomiciliariosAsync(Guid id)
        {
            var domiciliario = await _context.Domiciliarios.FindAsync(id);
            if (domiciliario == null)
            {
                return false;
            }
            _context.Domiciliarios.Remove(domiciliario);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
