using Microsoft.EntityFrameworkCore;
using SkyHelp;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class AuditoriaRepository : IAuditoriaRepository
    {
        private readonly SkyHelpContext _context;// Inyección de dependencia del contexto de la base de datos
        public AuditoriaRepository(SkyHelpContext context)
        {
            _context = context;
        }

        public async Task<List<Auditoria>> ObtenerAuditorias()
        {
            return await _context.Auditoria.ToListAsync();
        }
        public async Task<Auditoria> ObtenerAuditoriaPorID(Guid id)
        {
            return await _context.Auditoria.FirstOrDefaultAsync(x => x.IDLog == id);
        }
        public async Task<bool> CrearAuditoria(Auditoria auditoria)
        {
            try
            {
                await _context.Auditoria.AddAsync(auditoria);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> ActualizarAuditoria(Auditoria auditoria)
        {
            try
            {
                var auditoiraExistente = await _context.Auditoria.FirstOrDefaultAsync(x => x.IDLog == auditoria.IDLog);
                if (auditoiraExistente == null)
                {
                    return false;
                    throw new Exception("Auditoria Para Actualizar No Existe");
                }
                auditoiraExistente.TipoEvento = auditoria.TipoEvento;
                auditoiraExistente.TablaAfectada = auditoria.TablaAfectada;
                auditoiraExistente.IDRegistro = auditoria.IDRegistro;
                auditoiraExistente.Descripcion = auditoria.Descripcion;
                auditoiraExistente.FechaEvento = auditoria.FechaEvento;
                _context.Auditoria.Update(auditoiraExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }

        public async Task<bool> EliminarAuditoria(Guid id)
        {
            try
            {
                var auditoiraExistente = await _context.Auditoria.FirstOrDefaultAsync(x => x.IDLog == id);
                if (auditoiraExistente == null)
                {
                    return false;
                    throw new Exception("Auditoria Para Eliminar No Existe");
                }
                _context.Auditoria.Remove(auditoiraExistente);
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

