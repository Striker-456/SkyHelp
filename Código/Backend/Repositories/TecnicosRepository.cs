using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Repositories.Interfaces.SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class TecnicosRepository : ITecnicosRepository
    {
        private readonly SkyHelpContext _context;
        public TecnicosRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<List<Tecnicos>> ObtenerTecnicos()
        {
            return await _context.Tecnicos.ToListAsync();
        }
        public async Task<Tecnicos> ObtenerTecnicoPorId(Guid id)
        {
            return await _context.Tecnicos.FirstOrDefaultAsync(x => x.IdTecnico == id);
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
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> ActualizarTecnico(Tecnicos tecnico)
        {
            try
            {
                var tecnicoExistente = await _context.Tecnicos.FirstOrDefaultAsync(x => x.IdTecnico == tecnico.IdTecnico);
                if (tecnicoExistente == null)
                {
                    return false;
                    throw new Exception("Técnico para actualizar no existe");
                }
                tecnicoExistente.IdUsuario = tecnico.IdUsuario;
                tecnicoExistente.FechaResgistro = tecnico.FechaResgistro;
                _context.Tecnicos.Update(tecnicoExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> EliminarTecnico(Guid id)
        {
            try
            {
                var tecnicoExistente = await _context.Tecnicos.FirstOrDefaultAsync(x => x.IdTecnico == id);
                if (tecnicoExistente == null)
                {
                    return false;
                    throw new Exception("Técnico para eliminar no existe");
                }
                _context.Tecnicos.Remove(tecnicoExistente);
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
