using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class EvaluacionesRepository : IEvaluacionesRepository
    {
        private readonly SkyHelpContext _context;
        private readonly ILogger<EvaluacionesRepository> _logger;

        public EvaluacionesRepository(SkyHelpContext context, ILogger<EvaluacionesRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Evaluaciones>> ObtenerEvaluaciones()
        {
            return await _context.Evaluaciones.ToListAsync();
        }

        public async Task<Evaluaciones> ObtenerEvaluacionPorId(Guid id)
        {
            return await _context.Evaluaciones.FirstOrDefaultAsync(x => x.IdEvaluacion == id);
        }

        public async Task<bool> CrearEvaluacion(Evaluaciones evaluacion)
        {
            try
            {
                await _context.Evaluaciones.AddAsync(evaluacion);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la evaluación del ticket {IdTicket}", evaluacion.IdTicket);
                return false;
            }
        }

        public async Task<bool> ActualizarEvaluacion(Evaluaciones evaluacion)
        {
            try
            {
                var evaluacionExistente = await _context.Evaluaciones.FirstOrDefaultAsync(x => x.IdEvaluacion == evaluacion.IdEvaluacion);
                if (evaluacionExistente == null)
                {
                    return false;
                }
                evaluacionExistente.IdUsuario = evaluacion.IdUsuario;
                evaluacionExistente.IdTicket = evaluacion.IdTicket;
                evaluacionExistente.Calificacion = evaluacion.Calificacion;
                evaluacionExistente.Comentario = evaluacion.Comentario;
                evaluacionExistente.FechaEvaluacion = evaluacion.FechaEvaluacion;
                _context.Evaluaciones.Update(evaluacionExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la evaluación {IdEvaluacion}", evaluacion.IdEvaluacion);
                return false;
            }
        }

        public async Task<bool> EliminarEvaluacion(Guid id)
        {
            try
            {
                var evaluacionExistente = await _context.Evaluaciones.FirstOrDefaultAsync(x => x.IdEvaluacion == id);
                if (evaluacionExistente == null)
                {
                    return false;
                }
                _context.Evaluaciones.Remove(evaluacionExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la evaluación {IdEvaluacion}", id);
                return false;
            }
        }
    }
}
