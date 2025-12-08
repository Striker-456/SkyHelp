using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class EvaluacionesRepository : IEvaluacionesRepository
    {
        private readonly SkyHelpContext _context;

        public EvaluacionesRepository(SkyHelpContext context)
        {
            _context = context;
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
                return false;
                throw new Exception(ex.Message.ToString());
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
                    throw new Exception("Evaluación para actualizar no existe.");
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
                return false;
                throw new Exception(ex.Message.ToString());
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
                    throw new Exception("Evaluación para eliminar no existe.");
                }
                _context.Evaluaciones.Remove(evaluacionExistente);
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
